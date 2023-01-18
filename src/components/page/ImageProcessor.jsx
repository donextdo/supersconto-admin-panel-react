import React, {useEffect, useRef, useState} from 'react';
import ReactCrop from "react-image-crop";
import CroppedItemsPreview from "./CroppedItemsPreview.jsx";
import SingleItemPreview from "./SingleItemPreview.jsx";

function App({imgSrc, onClick, exCoordinates}) {
    const [src, setSrc] = useState(null)
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: undefined
    })
    const [croppedImages, setCroppedImages] = useState([])
    const [strokeImageUrl, setStrokeImageUrl] = useState("")
    const [coordinates, setCoordinates] = useState([])
    const imageRef = useRef()

    useEffect(() => {
        if (imageRef.current) {
            console.log("generate stroke", {coordinates})
            getStrokeImg(
                imageRef.current,
                coordinates,
                'newFile.jpeg'
            ).then(value => {
                setStrokeImageUrl(value);
            })

        }
    }, [coordinates, imageRef.current])

    useEffect(() => {
        setCoordinates([])
        setCroppedImages([])

        if (imageRef.current) {
/*
            const blah = () => {
                exCoordinates.map(async crop => {
                    await onCropComplete(crop)
                })
            }
            blah()*/

            const asyncTasks = exCoordinates.map(async (item, index) => {
                // perform async task and return result
                return await makeClientCrop2(item, generateUUID());
            });

            Promise.all(asyncTasks)
                .then((results) => {
                    console.log({results})
                    setCoordinates(results)
                })
                .catch((error) => console.error(error));

        }
        console.log('exCoordinates-effect', imageRef.current)
    }, [exCoordinates, imageRef.current])


    useEffect(() => {
        if (imgSrc) {
            getFileFromUrl(imgSrc, "test").then(r => {
                const reader = new FileReader();
                reader.addEventListener('load', () =>
                    setSrc(reader.result)
                );
                reader.readAsDataURL(r);
            })
        }
    }, [imgSrc])

    const getFileFromUrl = async (url, name, defaultType = 'image/jpeg') => {
        const response = await fetch(url);
        const data = await response.blob();
        return new File([data], name, {
            type: data.type || defaultType,
        });
    }

    const onImageLoaded = (image) => {
        console.log("image load call on rerender check")
        imageRef.current = image;
    };

    const onCropComplete = async (crop) => {
        const index = generateUUID()
        await makeClientCrop(crop, index);
    };

    const makeClientCrop = async (crop, index) => {
        console.log('makeClientCrop', {crop, coordinates})
        if (crop.x === 0 && crop.y === 0) return
        // setCoordinates(prevState => [...prevState, {...crop}])

        if (imageRef.current && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                'newFile.jpeg'
            );

            setCoordinates(prevState => [...prevState, {...crop, croppedImageUrl, index}])
            setCroppedImages(prevState => ([...prevState, {croppedImageUrl, index}]));

        }
    }
    const makeClientCrop2 = async (crop, index) => {
        console.log('makeClientCrop', {crop, coordinates})
        if (crop.x === 0 && crop.y === 0) return
        // setCoordinates(prevState => [...prevState, {...crop}])

        if (imageRef.current && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                'newFile.jpeg'
            );

            // setCoordinates(prevState => [...prevState, {...crop, croppedImageUrl}])
            setCroppedImages(prevState => ([...prevState, {croppedImageUrl,index}] ));
            return {...crop, croppedImageUrl, index}

        }
    }

    const onCropChange = (crop, percentCrop) => {
        // You could also use percentCrop:
        // this.setState({ crop: percentCrop });
        setCrop(crop);
    };

    const getCroppedImg = (image, crop, fileName) => {
        // console.log(image, crop, fileName)
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
        // console.log({scaleX, scaleY, h: image.width, w: image.height})


        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        //reject(new Error('Canvas is empty'));
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = fileName;
                    let fileUrl
                    window.URL.revokeObjectURL(fileUrl);
                    fileUrl = window.URL.createObjectURL(blob);
                    resolve(fileUrl);
                },
                'image/jpeg',
                1
            );
        });
    }

    const getStrokeImg = (image, coordinates, fileName) => {
        // console.log(image, crop, fileName)
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = image.width * pixelRatio * scaleX;
        canvas.height = image.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.setLineDash([10, 10]);
        ctx.strokeStyle = "blue";

        ctx.lineWidth = 10;

        // console.log({pixelRatio, scaleX, scaleY, h: image.width, w: image.height})
        ctx.drawImage(
            image
            , 0, 0,
            image.width * scaleX,
            image.height * scaleY,
            0,
            0,
            image.width * scaleX,
            image.height * scaleY
        );
        coordinates.forEach(crop => {
            ctx.strokeRect(
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
            );
        })


        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        //reject(new Error('Canvas is empty'));
                        console.error('Canvas is empty');
                        return;
                    }
                    blob.name = fileName;
                    let fileUrl
                    window.URL.revokeObjectURL(fileUrl);
                    fileUrl = window.URL.createObjectURL(blob);
                    resolve(fileUrl);
                },
                'image/jpeg',
                1
            );
        });
    }


    const handleRemove = (index) => {
        const cloneCo = [...coordinates].filter(co => co.index !== index)
        const clonePrev = [...croppedImages].filter(co => co.index !== index)

        setCoordinates(cloneCo)
        setCroppedImages(clonePrev)

    }

    const handleItemSelection = (data) => {
        console.log(data, croppedImages[data.index])
        console.log(croppedImages)
    }

    function generateUUID() {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    console.log('image-processor-rendered', {croppedImages,coordinates, exCoordinates})


    return (
        <>
            <div className="image-processor">
                <div className="cropper">

                    {src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={onImageLoaded}
                            onComplete={onCropComplete}
                            onChange={onCropChange}
                            // maxWidth={500}
                            // maxHeight={500}
                        />
                    )}
                </div>

                <CroppedItemsPreview cropImageUrl={croppedImages} handleRemove={handleRemove}/>

                {/*<StrokeImagePreview strokeImageUrl={strokeImageUrl}/>*/}

                <SingleItemPreview coordinates={coordinates} strokeImageUrl={strokeImageUrl}
                                   height={imageRef.current?.height} width={imageRef.current?.width}
                                   handleSelection={({crop, index}) => {
                                       console.log(index);
                                       onClick({crop})
                                       // setCoordinates([])
                                   }}
                                   imageHeight={imageRef.current?.height} imageWidth={imageRef.current?.width}/>


            </div>
            {/* <div>
                <input type="file" accept="image/*" onChange={onSelectFile}/>
            </div>*/}

        </>
    );
}

export default App;