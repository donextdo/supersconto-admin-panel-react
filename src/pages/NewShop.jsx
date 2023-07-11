import axios from "axios";
import { RiAddCircleLine } from "react-icons/ri";
import { ButtonNormal } from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import TextInput from "../components/shared/TextInput";
import React, { useEffect, useState } from "react";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Content, Card } from "../components/shared/Utils";
import Fileinput from "../components/shared/Fileinput";
import { Table, THead, TBody, TH, Row, TD } from "../components/shared/Table";
import { FaTrash } from "react-icons/fa";
import { PencilAltIcon } from "@heroicons/react/solid";
import baseUrl from "../utils/baseUrl.js";
import Alert from "../components/shared/Alert";
import MySwitch from "../components/shared/Switch";
import Confirm from "../components/shared/Confirm";
import { ToastContainer, toast } from "react-toastify";

const NewShop = () => {
    const [confirm, setConfirm] = useState(false);
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState(false);
    const [alertError, setAlertError] = useState(false);
    const [med, setMed] = useState("delete");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [formatAddress, setFormatAddress] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [hide, setHide] = useState(false);

    const [shopNameError, setShopNameError] = useState('')
    const [formError, setFormError] = useState('');




    const [isEdit, setIsEdit] = useState(false);
    const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : null
    console.log({userData})

    async function fetchData() {
        try {
            let res = []

            if (userData){
                if (userData?.userType === 0) {
                    res = await axios.get(`${baseUrl}/shop`);
                } else {
                    res = await axios.get(`${baseUrl}/shop/by-vendor/${userData?._id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${token}`,
                            'Accept': "application/json"
                        }
                    });
                }
            }
            setData(res.data);
            console.log("data : ", data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [formData, setFormData] = useState({
        shop_name: "",
        description: "",
        address: "",
        state: "",
        postal_code: "",
        shop_unique_id: "",
        owner_name: "",
        status: true,
        logo_img: "",
        latitude: "",
        longitude: "",
        shop_category: "",
        is_online_selling: false,
        province: "",
        municipality: "",
        telephone: "",
    });

    const onDelete = (id) => {
        sessionStorage.setItem("id", id);
        setMed("delete");
        setConfirm(true);
    };
    const toggleModal = () => {
        setModal(!modal);
        setFormData({
            shop_name: "",
            description: "",
            address: "",
            state: "",
            postal_code: "",
            shop_unique_id: "",
            owner_name: "",
            status: true,
            logo_img: "",
            latitude: "",
            longitude: "",
            shop_category: "",
            is_online_selling: false,
            province: "",
            municipality: "",
            // region: "",
            telephone: "",
        });
    };
    const [alertTitle, setAlertTitle] = useState(null);


    const setBodyFormData = (formData) => {
        const bodyFormData = new FormData();

        bodyFormData.append("shop_name", formData.shop_name);
        bodyFormData.append("description", formData.description);
        bodyFormData.append("address[address]", formData.address);
        bodyFormData.append("address[state]", formData.state);
        bodyFormData.append("address[postal_code]", formData.postal_code);
        bodyFormData.append("shop_unique_id", formData.shop_unique_id);
        bodyFormData.append("owner_name", formData.owner_name);
        bodyFormData.append("status", true);
        bodyFormData.append("logo_img", formData.logo_img);
        bodyFormData.append("latitude", formData.latitude);
        bodyFormData.append("longitude", formData.longitude);
        bodyFormData.append("shop_category", formData.shop_category);
        bodyFormData.append("is_online_selling", formData.is_online_selling);
        bodyFormData.append("telephone", formData.telephone);
        bodyFormData.append("role", userData.userType === 0 ? 'Admin' : 'Vendor');
        bodyFormData.append("vendor", userData._id);

        return bodyFormData
    };

    const onSave = async () => {
        console.log("ggggg : ", formData,setBodyFormData(formData));

        if (formData.address == "" || formData.shop_name == "" || formData.logo_img == '') {
            setFormError('Please fill in the required field marked with an asterisk (*).');
        } else {
            setFormError('');

            await axios({
                method: "post",
                url: `${baseUrl}/shop`,
                data: setBodyFormData(formData),
                headers: { "Content-Type": "multipart/form-data" },
            })
                .then((response) => {
                    setAlertError(false);

                    console.log(response.data);
                    fetchData();
                    return toast.success("Data inserted successfully");
                })
                .catch(function (error) {
                    console.log(" error", error);
                    return toast.error(error.message);
                });
            toggleModal();

        }

    };

    const CurrentData = (data) => {
        setFormData((prevState) => {
            return {
                ...prevState,
                ["shop_name"]: data.shop_name,
                ["update"]: true,
                ["id"]: data._id,
            };
        });
    };
    const tryUpdate = () => {
        setIsEdit(false);
        setModal(!modal);
        setMed("update");
        setConfirm(true);
    };

    const toUpdate = async (data) => {
        setIsEdit(true);
        console.log();
        sessionStorage.setItem("id", data._id);
        setFormData({
            shop_name: data.shop_name,
            description: data.description,
            address: data.address.address,
            state: data.address.state,
            postal_code: data.address.postal_code,
            shop_unique_id: data.shop_unique_id,
            owner_name: data.owner_name,
            status: data.status,
            logo_img: data.logo_img,
            latitude: data.latitude,
            longitude: data.longitude,
            shop_category: data.shop_category,
            is_online_selling: data.is_online_selling,
            telephone: data.telephone,
        });
        setModal(true);
    };

    const toDelete = async (id) => {
        try {
            const res = await axios.delete(
                `${baseUrl}/shop/${sessionStorage.getItem("id")}`
            );
            console.log(res.data);
            setAlertError(false);
            toast.success("Data Deleted Successfully");

            fetchData();
        } catch (error) {
            setAlertError(true);
            console.log(error);
            toast.error(error.message);
            console.log(error);
        }
        setConfirm(false);
    };
    const onClose = () => {
        toggleModal();
    };

    const onUpdate = async () => {
        console.log(formData);
        await axios({
            method: "patch",
            url: `${baseUrl}/shop/${sessionStorage.getItem("id")}`,
            data: setBodyFormData(formData),
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then((response) => {
                setAlertError(false);
                fetchData();

                return toast.success("Data updated successfully");
            })
            .catch(function (error) {
                console.log(error);
                fetchData();
                return toast.error(error.message);
            });
        setConfirm(false);
    };

    const onCancel = () => {
        setModal(false);
    };

    const update = (name, e) => {
        if (name == "is_online_selling") {
            setFormData((prevState) => {
                return { ...prevState, [name]: !prevState.is_online_selling };
            });
        } else
            setFormData((prevState) => {
                return { ...prevState, [name]: e.target.value };
            });

        // if(name=="shop_name"){
        //     const shopName = e.target.value;
        //     if (shopName === '') {
        //         setShopNameError('First name cannot be empty');
        //     } else {
        //         setShopNameError('');
        //     }
        // }

    };

    const updateImg = (name, e) => {
        setFormData((prevState) => {
            return { ...prevState, [name]: e.target.files[0] };
        });
    };

    const handleInputChange = (event) => {
        setHide(false);
        const inputValue = event.target.value;

        // Create a new instance of AutocompleteService
        const autocompleteService =
            new window.google.maps.places.AutocompleteService();

        // Call the getPlacePredictions method to fetch location suggestions
        autocompleteService.getPlacePredictions(
            { input: inputValue },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setPredictions(predictions);
                }
            }
        );
    };

    function handlePlaceSelection(place_id) {
        setHide(false);
        console.log("place_id: ", place_id);
        const placeService = new window.google.maps.places.PlacesService(
            document.createElement("div")
        );
        console.log("placeService: ", placeService);
        placeService.getDetails(
            { placeId: place_id },
            (placeResult, placeStatus) => {
                console.log("placeResult: ", placeResult);

                if (
                    placeStatus === window.google.maps.places.PlacesServiceStatus.OK &&
                    placeResult
                ) {
                    const lat = placeResult.geometry?.location?.lat();
                    const lng = placeResult.geometry?.location?.lng();
                    const formattedAddress = placeResult.formatted_address;

                    setFormData((prevState) => {
                        return { ...prevState, address: formattedAddress, latitude: lat, longitude: lng };
                    })
                    setHide(true);
                    console.log("Formatted Address: ", formattedAddress);
                    console.log("Formatted lat: ", latitude);
                    console.log("Formatted lng: ", longitude);
                }
            }
        );
    }

    console.log(formData)

    return (
        <div>
            <>
                <ToastContainer />
                {confirm && (
                    <Confirm
                        onSave={med == "delete" ? toDelete : onUpdate}
                        onCancel={() => setConfirm(false)}
                        onClose={() => setConfirm(false)}
                        method={med}
                    ></Confirm>
                )}
                {alertMessage && (
                    <Alert title={alertTitle} error={alertError} width="60%"></Alert>
                )}
                {modal && (
                    <Modal
                        onClose={onClose}
                        onCancel={onCancel}
                        onSave={isEdit ? tryUpdate : onSave}
                        title={isEdit ? "Edit Shop" : "Create Shop"}
                        width="w-1/2"
                    >
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Shop Name *"
                                    border
                                    value={formData.shop_name}
                                    onChange={(e) => update("shop_name", e)}
                                    borderColor="border-gray-600"
                                    
                                />
                            </div>

                        </div>
                        {shopNameError && <div className='text-red-500'>{shopNameError}</div>}

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Telephone"
                                    border
                                    value={formData.telephone}
                                    onChange={(e) => update("telephone", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Address *"
                                    value={formData.address}
                                    onChange={(e) => {
                                        update("address", e);
                                        handleInputChange(e);
                                    }}
                                    border
                                    borderColor="border-gray-600"
                                    
                                />
                                {predictions.length > 0 && !hide && (
                                    <ul className="mb-4">
                                        {predictions.map((prediction) => (
                                            <li
                                                key={prediction.place_id}
                                                onClick={() =>
                                                    handlePlaceSelection(prediction.place_id)
                                                }
                                                className="cursor-pointer p-2 border hover:bg-gray-100"
                                            >
                                                {prediction.description}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>


                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Municipality"
                                    value={formData.postal_code}
                                    onChange={(e) => update("postal_code", e)}
                                    border
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    value={formData.shop_unique_id}
                                    onChange={(e) => update("shop_unique_id", e)}
                                    label="CAP"
                                    border
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Fileinput
                                    label={"Logo Image *"}
                                    onChange={(e) => updateImg("logo_img", e)}
                                    value={formData.logo_img}
                                />

                            </div>
                            <div className="flex-1">
                                <MySwitch
                                    label="Does Online Selling"
                                    border
                                    value={formData.is_online_selling}
                                    onChange={(e) => update("is_online_selling", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    value={formData.latitude}
                                    onChange={(e) => update("latitude", e)}
                                    label="Google Map Latitude"
                                    border
                                    borderColor="border-gray-600"
                                />
                            </div>
                            <div className="flex-1">
                                <TextInput
                                    value={formData.longitude}
                                    onChange={(e) => update("longitude", e)}
                                    label="Google Map Longitude"
                                    border
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        {formError && <div className='text-red-500'>{formError}</div>}

                    </Modal>
                )}
                <Card>
                    <div className="w-full py-4 flex gap-6">
                        <ButtonNormal onClick={toggleModal}>
                            <RiAddCircleLine className="w-5 h-5" />
                            <span>Add</span>
                        </ButtonNormal>
                    </div>
                    <Table>
                        <THead>
                            <TH title={"Id"} />
                            <TH title={"Shop Name"} />
                            <TH title={"Contact"} />
                            <TH title={"Address"} />
                            <TH title={"Status"} />
                            <TH title={"Logo"} />
                            <TH title={"Actions"} />
                        </THead>

                        <TBody>
                            {data.map((d) => {
                                return (
                                    <Row key={d._id}>
                                        <TD>{d._id}</TD>

                                        <TD>{d.shop_name}</TD>

                                        <TD>{d.telephone}</TD>

                                        <TD>
                                            {d.address.address}

                                            {d.address.state}
                                        </TD>
                                        <TD>{d.status ? "true" : "false"}</TD>
                                        <TD>
                                            <img
                                                className="w-1/2 h-1/2"
                                                src={
                                                    d.logo_img ||
                                                    "https://images.freeimages.com/images/previews/09e/moon-art-1641879.png"
                                                }
                                                alt="Shop Logo"
                                            ></img>
                                        </TD>
                                        <TD>
                                            <div className="w-full h-full flex items-center justify-center gap-4">
                                                <FaTrash
                                                    onClick={() => onDelete(d._id)}
                                                    className="w-3 h-3 fill-red-500 cursor-pointer"
                                                />
                                                <PencilAltIcon
                                                    onClick={() => toUpdate(d)}
                                                    className="w-4 h-4 fill-blue-500 cursor-pointer"
                                                />
                                            </div>
                                        </TD>
                                    </Row>
                                );
                            })}
                        </TBody>
                    </Table>
                </Card>
            </>
            {/* </Content> */}
        </div>
    );
};

export default NewShop;
