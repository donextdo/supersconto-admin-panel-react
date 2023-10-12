import React, {useEffect, useRef, useState} from 'react';
import ReactCrop from "react-image-crop";
import CroppedItemsPreview from "./CroppedItemsPreview.jsx";
import SingleItemPreview from "./SingleItemPreview.jsx";
import {FaRegCheckCircle} from "react-icons/fa";

function App({imgSrc, onClick, exCoordinates}) {
    const [src, setSrc] = useState(null)
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: undefined
    })
    const [croppedImages, setCroppedImages] = useState([])
    const [strokeImageUrl, setStrokeImageUrl] = useState("")
    const [coordinates, setCoordinates] = useState([])
    const [showButton, setShowButton] = useState(false)
    const imageRef = useRef()

    useEffect(() => {
        if (imageRef.current) {
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
        // setCoordinates([])
        setCroppedImages([])

        if (imageRef.current) {
            console.log({exCoordinates, coordinates})

            const itemMap = new Map();
            coordinates.forEach((item) => {
                itemMap.set(`${item.x}-${item.y}`, item);
            });

            exCoordinates.forEach((item) => {
                itemMap.set(`${item.x}-${item.y}`, item);
            });

            const data = Array.from(itemMap.values());
            console.log({data});

            const asyncTasks = data.map(async (item, index) => {
                // perform async task and return result
                return await loadPreviousData(item, generateUUID());
            });
            Promise.all(asyncTasks)
                .then((results) => {
                    console.log({results, coordinates})
                    // setCoordinates(arr => [...arr, ...results.filter(result => !arr.some(item => item.x === result.x && item.y === result.y))])
                    // setCoordinates(temp1 => [...results,...temp1.filter(t1 => results.some(t2 => t2.x !== t1.x && t2.y !== t1.y))])
                    setCoordinates(results)
                })
                .catch((error) => console.error(error));
        }
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
        imageRef.current = image;
    };

    const onCropComplete = async () => {
        await makeClientCrop(crop, generateUUID());
    };

    const makeClientCrop = async (crop, index) => {
        if (crop.x === 0 && crop.y === 0) return

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

    const loadPreviousData = async (crop, index) => {
        if (crop.x === 0 && crop.y === 0) return

        if (imageRef.current && crop.width && crop.height) {
            const croppedImageUrl = await getCroppedImg(
                imageRef.current,
                crop,
                'newFile.jpeg'
            );

            setCroppedImages(prevState => ([...prevState, {croppedImageUrl,index}] ));
            return {...crop, croppedImageUrl, index}

        }
    }

    const onCropChange = (crop, percentCrop) => {
        setShowButton(false)
        setCrop(crop);
    };

    const getCroppedImg = (image, crop, fileName) => {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

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
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = image.width * pixelRatio * scaleX;
        canvas.height = image.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
        ctx.setLineDash([20, 10]);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#3b82f6";

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

    const generateUUID = () => {
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

    console.log('image-processor-rendered', {croppedImages,coordinates,crop, exCoordinates,imageHeight: imageRef.current?.height, imageWidth:imageRef.current?.width})

    return (
        <div className="min-h-screen max-w-[1440px] mx-auto">
            <div className="image-processor">
                <div className="cropper">

                    {src && (
                        <ReactCrop
                            src={src}
                            crop={crop}
                            ruleOfThirds
                            onImageLoaded={onImageLoaded}
                            onChange={onCropChange}
                            onComplete={() => setShowButton(true)}
                        />
                    )}

                    {showButton && crop.width > 0 && <FaRegCheckCircle className="crop-save" style={{top: `${crop.y - 10}px`, left: `${crop.x + crop.width - 10}px`}}
                             onClick={onCropComplete}></FaRegCheckCircle>}
                </div>



                {/*<StrokeImagePreview strokeImageUrl={strokeImageUrl}/>*/}

                <SingleItemPreview coordinates={coordinates} strokeImageUrl={strokeImageUrl}
                                   height={imageRef.current?.height} width={imageRef.current?.width}
                                   handleSelection={({crop, index}) => {
                                       onClick({crop})
                                   }}
                                   imageHeight={imageRef.current?.height} imageWidth={imageRef.current?.width}
                />
            </div>
            <CroppedItemsPreview cropImageUrl={croppedImages} handleRemove={handleRemove}/>


        </div>
    );
}

export default App;