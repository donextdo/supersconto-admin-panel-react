import axios from "axios";
import {RiAddCircleLine, RiFilter2Fill} from "react-icons/ri";
import {ButtonDanger, ButtonNormal, ButtonSuccess} from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import TextInput from "../components/shared/TextInput";
import React, {useEffect, useState} from "react";
import {Card} from "../components/shared/Utils";
import Fileinput from "../components/shared/Fileinput";
import {Row, Table, TBody, TD, TH, THead} from "../components/shared/Table";
import {FaTrash} from "react-icons/fa";
import {PencilAltIcon, XCircleIcon, XIcon} from "@heroicons/react/solid";
import baseUrl from "../utils/baseUrl.js";
import Alert from "../components/shared/Alert";
import MySwitch from "../components/shared/Switch";
import Confirm from "../components/shared/Confirm";
import {toast, ToastContainer} from "react-toastify";
import Dropdown from "../components/shared/Dropdown.jsx";
import CustomTooltip from "../components/shared/Tooltip";
import {MdArrowDropDown} from "react-icons/md";
import Swal from "sweetalert2";
import DropdownComponent from "../components/advanced-filter/DropdownComponent.jsx";
import {convertToTitleCase} from "../utils/functions.js";

const NewShop = () => {
    const [confirm, setConfirm] = useState(false);
    const [data, setData] = useState([]);
    const [modal, setModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState(false);
    const [alertError, setAlertError] = useState(false);
    const [alertShopError, setAlertShopError] = useState(false);
    const [med, setMed] = useState("delete");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [formatAddress, setFormatAddress] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [hide, setHide] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [shopNameError, setShopNameError] = useState('')
    const [formError, setFormError] = useState('');
    const [vendors, setVendors] = useState([])
    const [formData, setFormData] = useState({
        shop_name: "",
        customized_shop_name: "",
        description: "",
        address: "",
        city: "",
        cityCode: "",
        country: "",
        countryCode: "",
        administrativeOne: "",
        administrativeTwo: "",
        administrativeThree: "",
        street: "",
        route: "",
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
        vendor: "",
        role: "",
        website: "",

    });

    const [isEdit, setIsEdit] = useState(false);
    const [filterData, setFilterData] = useState({})
    const [filterData2, setFilterData2] = useState({})
    const [filterOptions, setFilterOptions] = useState([])
    const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
    const token = localStorage.getItem("token") ? localStorage.getItem("token") : null
    console.log({ userData })
    const isAdmin = userData?.userType === 0;

    useEffect(() => {
        if (isAdmin) {
            fetchVendorData()
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [page, search, itemsPerPage,filterData2]);

    async function fetchData() {
        try {
            let res = []

            if (userData) {
                if (isAdmin) {
                    res = await axios.post(`${baseUrl}/shop/apply-filters`, {
                        filterData:filterData2,
                        params: {
                            page,
                            search,
                            itemsPerPage,
                        },
                    });
                } else {
                    res = await axios.post(`${baseUrl}/shop/apply-filters-vendor`, {
                        filterData: {...filterData2, vendorId: userData?._id},
                        params: {
                            page,
                            search,
                            itemsPerPage,
                        },
                    },{
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${token}`,
                            'Accept': "application/json"
                        }
                    });
                }
            }
            const filtersRes = await axios.get(`${baseUrl}/shop/filters`);
            setFilterOptions(filtersRes.data)
            setData(res.data.shops);
            setTotalPages(res.data.totalPages)
            console.log("data : ", res.data);
        } catch (err) {
            console.log(err);
        }
    }

    async function fetchVendorData() {
        try {
            const res = await axios.get(`${baseUrl}/vendor`);
            console.log(res)
            const vendorsList = res.data.map(vendor => ({ value: vendor._id, label: vendor.username, role: "Vendor" }))
            vendorsList.push({ value: userData._id, label: userData.username, role: "Admin" })
            setVendors(vendorsList);
        } catch (err) {
            console.log(err);
        }
    }


    const onDelete = (id) => {
        sessionStorage.setItem("id", id);
        setMed("delete");
        setConfirm(true);
    };

    const toggleModal = () => {
        setModal(!modal);
        const role = isAdmin ? "Admin" : "Vendor"
        const vendor = userData._id

        setFormData({
            shop_name: "",
            customized_shop_name: "",
            description: "",
            address: "",
            city: "",
            cityCode: "",
            country: "",
            countryCode: "",
            administrativeOne: "",
            administrativeTwo: "",
            administrativeThree: "",
            street: "",
            route: "",
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
            role: role,
            vendor: vendor,
            website: "",

        });
    };
    const [alertTitle, setAlertTitle] = useState(null);


    const setBodyFormData = (formData) => {
        const bodyFormData = new FormData();

        let role, vendor
        if (isAdmin) {
            role = formData.role
            vendor = formData.vendor
        } else {
            role = "Vendor"
            vendor = userData._id
        }
        bodyFormData.append("shop_name", formData.shop_name);
        bodyFormData.append("customized_shop_name", formData.customized_shop_name);
        bodyFormData.append("description", formData.description);
        bodyFormData.append("address[address]", formData.address);
        bodyFormData.append("address[state]", formData.state);
        bodyFormData.append("postal_code", formData.postal_code);
        bodyFormData.append("shop_unique_id", formData.shop_unique_id);
        bodyFormData.append("owner_name", formData.owner_name);
        bodyFormData.append("status", true);
        bodyFormData.append("logo_img", formData.logo_img);
        bodyFormData.append("latitude", formData.latitude);
        bodyFormData.append("longitude", formData.longitude);
        bodyFormData.append("shop_category", formData.shop_category);
        bodyFormData.append("is_online_selling", formData.is_online_selling);
        bodyFormData.append("telephone", formData.telephone);
        bodyFormData.append("role", role);
        bodyFormData.append("vendor", vendor);
        bodyFormData.append("website", formData.website);
        bodyFormData.append("city", formData.city);
        bodyFormData.append("cityCode", formData.cityCode);
        bodyFormData.append("country", formData.country);
        bodyFormData.append("countryCode", formData.countryCode);
        bodyFormData.append("administrativeOne", formData.administrativeOne);
        bodyFormData.append("administrativeTwo", formData.administrativeTwo);
        bodyFormData.append("administrativeThree", formData.administrativeThree);
        bodyFormData.append("street", formData.street);
        bodyFormData.append("route", formData.route);




        return bodyFormData
    };

    const onSave = async () => {
        console.log("ggggg : ", formData, setBodyFormData(formData));

        if (formData.address == "" || formData.shop_name == "" || formData.logo_img == '') {
            setFormError('Please fill in the required field marked with an asterisk (*).');
        } else {
            setFormError('');

            handlecheckName()

            // await axios({
            //     method: "post",
            //     url: `${baseUrl}/shop`,
            //     data: setBodyFormData(formData),
            //     headers: { "Content-Type": "multipart/form-data" },
            // })
            //     .then((response) => {
            //         setAlertError(false);

            //         console.log(response.data);
            //         fetchData();
            //         return toast.success("Data inserted successfully");
            //     })
            //     .catch(function (error) {
            //         console.log(" error", error);
            //         return toast.error(error.message);
            //     });
            // toggleModal();

        }

    };
    const handlecheckName = async () => {
        try {
            const response = await fetch(`${baseUrl}/shop/check-name`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shop_name: formData.shop_name }),
            });

            const data = await response.json();
            console.log(response)

            if (response.status == 200) {
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
            } else if (response.status == 400) {
                Swal.fire({
                    title: 'Shop name already exists',
                    text: 'Are you sure you want to continue?',
                    icon: 'warning',
                    showCancelButton: true, // Add this line to show the cancel button
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel', // Add this line to set the cancel button text
                    confirmButtonColor: '#8DC14F',
                }).then(async (result) => {
                    if (result.isConfirmed) {
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
                });
            }
        } catch (error) {
            console.error(error);
        }
    }


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
        console.log(data);
        sessionStorage.setItem("id", data._id);
        setFormData({
            shop_name: data.shop_name,
            customized_shop_name: data.customized_shop_name,
            description: data.description,
            address: data.address.address,
            state: data.address.state,
            postal_code: data.postal_code,
            shop_unique_id: data.shop_unique_id,
            owner_name: data.owner_name,
            status: data.status,
            logo_img: data.logo_img,
            latitude: data.latitude,
            longitude: data.longitude,
            shop_category: data.shop_category,
            is_online_selling: data.is_online_selling,
            telephone: data.telephone,
            website: data.website,
            vendor: data.vendor,
            role: data.role,
            city: data.city,
            cityCode: data.cityCode,
            country: data.country,
            countryCode: data.countryCode,
            administrativeOne: data.administrativeOne,
            administrativeTwo: data.administrativeTwo,
            administrativeThree: data.administrativeThree,
            street: data.street,
            route: data.route,


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
        console.log({ name, e })
        if (name === "is_online_selling") {
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
                    const sName = placeResult.name;
                    const formatted_phone_number = placeResult.formatted_phone_number;
                    const website = placeResult.website;

                    const addressComponents = placeResult.address_components;

                    // Find the component that represents the city or administrative area level 1
                    const cityComponent = addressComponents.find(
                        (component) =>
                            component.types.includes('locality') ||
                            component.types.includes('administrative_area_level_1')
                    );



                    const administrativeThreeObj = addressComponents.find(item =>
                        item.types.includes('administrative_area_level_3') &&
                        item.types.includes('political')
                    );

                    const cityObj = addressComponents.find(item =>
                        item.types.includes('administrative_area_level_2') &&
                        item.types.includes('political')
                    );

                    const administrativeOneObj = addressComponents.find(item =>
                        item.types.includes('administrative_area_level_1') &&
                        item.types.includes('political')
                    );


                    const countryObj = addressComponents.find(item =>
                        item.types.includes('country') &&
                        item.types.includes('political')
                    );

                    const streetObj = addressComponents.find(item =>
                        item.types.includes('street_number')
                    );

                    const routeObj = addressComponents.find(item =>
                        item.types.includes('route')
                    );

                    const postalObj = addressComponents.find(item =>
                        item.types.includes('postal_code')
                    )


                    // Extract the city name from the cityComponent object
                    const cityName = cityComponent ? cityComponent.long_name : 'City not found';
                    const cityCode = cityObj ? cityObj.short_name : 'City Code not found';
                    const countryName = countryObj ? countryObj.long_name : 'Country not found';
                    const countryCode = countryObj ? countryObj.short_name : 'Country Code not found';
                    const street = streetObj ? streetObj.long_name : 'Street not found';
                    const route = routeObj ? routeObj.long_name : 'Route not found';
                    const postal_code = postalObj ? postalObj.long_name : 'Route not found';
                    const administrativeOne = administrativeOneObj ? administrativeOneObj.long_name : 'administrativeOne not found';
                    const administrativeTwo = cityObj ? cityObj.long_name : 'administrativeTwo not found';
                    const administrativeThree = administrativeThreeObj ? administrativeThreeObj.long_name : 'administrativeThree not found';





                    setFormData((prevState) => {
                        return { ...prevState, address: formattedAddress, latitude: lat, longitude: lng, shop_name: sName, telephone: formatted_phone_number, website: website, city: cityName, cityCode: cityCode, country: countryName, countryCode: countryCode, administrativeOne: administrativeOne, administrativeTwo: administrativeTwo, administrativeThree: administrativeThree, street: street, route: route, postal_code: postal_code };
                    })
                    setHide(true);
                    console.log("Formatted Address: ", formattedAddress);
                    console.log("Formatted lat: ", latitude);
                    console.log("Formatted lng: ", longitude);
                    console.log('City:', cityName);
                    console.log('Citycode:', street, route, postal_code, administrativeOne, administrativeTwo, administrativeThree);


                }
            }
        );
    }


    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const renderPageButtons = () => {
        const maxVisibleButtons = 5; // Adjust as needed
        const buttons = [];

        if (totalPages <= maxVisibleButtons) {
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                buttons.push(
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}
                    >
                        {pageNum}
                    </button>
                );
            }
        } else {
            const startPage = Math.max(1, page - Math.floor(maxVisibleButtons / 2));
            const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

            if (startPage > 1) {
                buttons.push(
                    <button key="1" onClick={() => handlePageChange(1)}>
                        1
                    </button>
                );
                if (startPage > 2) {
                    buttons.push(<span key="ellipsis-start">...</span>);
                }
            }

            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                buttons.push(
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`py-1 px-2 text-white  ${page === pageNum ? 'border-2 border-black bg-gray-400' : 'bg-gray-400 border'}`}

                    >
                        {pageNum}
                    </button>
                );
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    buttons.push(<span key="ellipsis-end">...</span>);
                }
                buttons.push(
                    <button key={totalPages} onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </button>
                );
            }
        }

        return buttons;
    }

    console.log("formData", formData)
    console.log("page", itemsPerPage)


    const handleFilterClick = (filter,value) => {
        console.log({filter, value})
        setFilterData(prevState => ({...prevState, [filter]:value}))
    }

    console.log(filterData)
    const applyFilter = async () => {
        setData([])
        setFilterData2(filterData)
        setPage(1)
    }

    const resetFilter = () => {
        setData([])
        setFilterData({})
        setFilterData2(filterData)
    }
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
                                    label="Shop Name *"
                                    border
                                    value={formData.shop_name}
                                    onChange={(e) => {
                                        update("shop_name", e)

                                    }}
                                    borderColor="border-gray-600"

                                />
                            </div>

                        </div>
                        {shopNameError && <div className='text-red-500'>{shopNameError}</div>}

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Customized Shop Name"
                                    value={formData.customized_shop_name}
                                    onChange={(e) => update("customized_shop_name", e)}
                                    border
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        {
                            isAdmin && (<Dropdown
                                label="Select vendor"
                                defaultValue={vendors.find(
                                    (vendor) => vendor.value === formData.vendor
                                )}
                                value={vendors.find(
                                    (vendor) => vendor.value === formData.vendor
                                )}
                                options={vendors}
                                onChange={(e) => {
                                    update("vendor", {
                                        target: {
                                            value: e.value
                                        }
                                    })
                                    update("role", {
                                        target: {
                                            value: e.role
                                        }
                                    })
                                }}
                            />)

                        }
                        {isAdmin && (<div className="text-gray-500 -mt-4">* Please select a vender</div>)}

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
                                    label="City"
                                    border
                                    value={formData.city}
                                    onChange={(e) => update("city", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="City Code"
                                    border
                                    value={formData.cityCode}
                                    onChange={(e) => update("cityCode", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Country"
                                    border
                                    value={formData.country}
                                    onChange={(e) => update("country", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Country Code"
                                    border
                                    value={formData.countryCode}
                                    onChange={(e) => update("countryCode", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Administrative One"
                                    border
                                    value={formData.administrativeOne}
                                    onChange={(e) => update("administrativeOne", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Administrative Two"
                                    border
                                    value={formData.administrativeTwo}
                                    onChange={(e) => update("administrativeTwo", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>   <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Administrative Three"
                                    border
                                    value={formData.administrativeThree}
                                    onChange={(e) => update("administrativeThree", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>   <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Street"
                                    border
                                    value={formData.street}
                                    onChange={(e) => update("street", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>   <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Route"
                                    border
                                    value={formData.route}
                                    onChange={(e) => update("route", e)}
                                    borderColor="border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <TextInput
                                    label="Postal Code"
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
                                    value={formData.website}
                                    onChange={(e) => update("shop_unique_id", e)}
                                    label="Website"
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



                <DropdownComponent cardStyleClass="pb-0" topic="Shop Filter" styleClass="advanced-filter" bodyStyleClass="flex gap-4 flex-wrap">
                    <>
                        <div className="selected-filters flex flex-wrap items-center w-full gap-4 pt-2">
                            {Object.keys(filterData).map((data, index) => (
                                <div className="flex flex-1 items-center justify-between border-2 basis-1/5 max-w-[250px]" key={`${data}-${index}`}>
                                    <span className="truncate">{convertToTitleCase(data)} : {filterData[data]}</span>
                                    <span className="remove-filter cursor-pointer  flex-shrink-0" onClick={() => {
                                        const updatedFilterData = { ...filterData };
                                        delete updatedFilterData[data];
                                        setFilterData(updatedFilterData);
                                    }}><XIcon className='w-4 h-4 fill-blue-500  flex-shrink-0 pointer-events-none'/></span>

                                </div>
                            ))}
                            <ButtonSuccess onClick={applyFilter}>
                                <RiFilter2Fill className="w-5 h-5" />
                                <span>Apply filter</span>
                            </ButtonSuccess>
                            <ButtonDanger onClick={resetFilter}>
                                <XCircleIcon className="w-5 h-5" />
                                <span>Reset</span>
                            </ButtonDanger>
                        </div>

                        <div className="flex basis-full gap-4">
                            <input
                            type="text"
                            value={filterData.shop_name ?? ""}
                            onChange={(e) => handleFilterClick("shop_name", e.target.value)}
                            placeholder="Shop Name"
                            className="border py-2 px-4 rounded-md flex-1"
                        />
                            <input
                                type="text"
                                value={filterData.customized_shop_name ?? ""}
                                onChange={(e) => handleFilterClick("customized_shop_name", e.target.value)}
                                placeholder="Customized Shop Name"
                                className="border py-2 px-4 rounded-md flex-1"
                            />
                        </div>


                        {Object.keys(filterOptions).map((topic, index) => {

                            return (

                                <DropdownComponent key={`${topic}-${index}`} topic={topic} styleClass="filter-item">
                                    <ul>
                                        {
                                            filterOptions[topic].map((item, index) => (
                                                <li key={`${item}-${index}`}
                                                    onClick={() => handleFilterClick(topic, item)}>{item}</li>
                                            ))
                                        }
                                    </ul>
                                </DropdownComponent>
                            )
                        })}</>



                </DropdownComponent>

                <Card>
                    <div className="w-full py-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="py-4 flex flex-col md:flex-row gap-6">
                            <ButtonNormal onClick={toggleModal}>
                                <RiAddCircleLine className="w-5 h-5" />
                                <span>Add</span>
                            </ButtonNormal>

                        </div>

                        <div className="relative">
                            <select
                                id="shop"
                                value={itemsPerPage}
                                onChange={(event) => setItemsPerPage(event.target.value)}
                                className="w-20 px-6 py-2 border bg-white border-slate-400 text-gray-600 text-sm font-semibold focus:outline-none appearance-none"
                            >

                                {[
                                    10,
                                    25,
                                    50,
                                    100,
                                ].map((option, index) => (
                                    <option key={index} value={option} className="text-sm font-semibold text-gray-500 appearance-none">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <MdArrowDropDown className="text-gray-600 text-lg absolute right-4 top-0 bottom-0 my-auto cursor-pointer pointer-events-none" />
                        </div>

                    </div>
                    <Table>
                        <THead>
                            <TH title={"Id"} />
                            <TH title={"Shop Name"} />
                            <TH title={"Contact"} />
                            <TH title={"Address"} />
                            <TH title={"Status"} />
                            <TH title={"Logo"} />
                            <TH title={"City"} />
                            <TH title={"City Code"} />
                            <TH title={"Administrative One"} />
                            <TH title={"Administrative Two"} />
                            <TH title={"Administrative Three"} />
                            <TH title={"Street"} />
                            <TH title={"Route"} />
                            <TH title={"Postal Codee"} />
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
                                        <TD>{d.city}</TD>
                                        <TD>{d.cityCode}</TD>
                                        <TD>{d.administrativeOne}</TD>
                                        <TD>{d.administrativeTwo}</TD>
                                        <TD>{d.administrativeThree}</TD>
                                        <TD>{d.street}</TD>
                                        <TD>{d.route}</TD>
                                        <TD>{d.postal_code}</TD>


                                        <TD>
                                            <div className='w-full h-full flex items-center justify-center gap-4'>
                                                <CustomTooltip content="Delete">
                                                    <FaTrash onClick={() => onDelete(d._id)} className='w-3 h-3 fill-red-500 cursor-pointer' />
                                                </CustomTooltip>
                                                <CustomTooltip content="Edit">
                                                    <PencilAltIcon onClick={() => toUpdate(d)} className='w-4 h-4 fill-blue-500 cursor-pointer' />
                                                </CustomTooltip>
                                            </div>
                                        </TD>
                                    </Row>
                                );
                            })}
                        </TBody>
                    </Table>

                    <div className="flex mt-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className={`py-1 px-2  text-white ${page === 1 ? "bg-black opacity-10 text-gray-100" : "bg-green-900"}`}
                        >
                            Previous
                        </button>
                        {renderPageButtons()}
                        <button
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className={`py-1 px-2  text-white ${page === totalPages ? "bg-black opacity-10 text-gray-100" : "bg-green-900"}`}

                        >
                            Next
                        </button>
                    </div>
                </Card>
            </>
            {/* </Content> */}
        </div>
    );
};

export default NewShop;
