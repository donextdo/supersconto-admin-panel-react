import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import TextInput from "../shared/TextInput";
import Dropdown from "../shared/Dropdown";
import Textarea from "../shared/Textarea";
import baseUrl from "../../utils/baseUrl.js";
import {useLocation} from "react-router-dom";

const Form = ({pageItem, setPageItem, modelMode}) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState(0);
    const [discount, setDiscount] = useState(0); // Default discount of 10%
    const [price, setPrice] = useState(0)
    const [subCategories, setSubCategories] = useState([]);
    const subList = useRef({});
    const [subCategoriesLevelTwo, setSubCategoriesLevelTwo] = useState([]);
    const [subCategoriesLevelThree, setSubCategoriesLevelThree] = useState([]);
    const [subCategoriesLevelFour, setSubCategoriesLevelFour] = useState([]);
    const [loading, setLoading] = useState(false)
    const editHistory = useRef(JSON.parse(JSON.stringify(pageItem)))

    useEffect(() => {
        setLoading(true)

        setPageItem({
            ...pageItem,
            catelog_book_id: queryParams.get('catelog'),
        });

        editHistory.current = JSON.parse(JSON.stringify(pageItem))

        axios
            .get(`${baseUrl}/category/categories`)
            .then((res) => {
                console.log({res});
                setCategories(categoryMapper(res.data?.mainCategories) ?? []);
                subList.current = {
                    subCategories: categoryMapper(res.data?.subCategories) ?? [],
                    subCategoriesLevelTwo: categoryMapper(res.data?.subCategoriesLevelTwo) ?? [],
                    subCategoriesLevelThree: categoryMapper(res.data?.subCategoriesLevelThree) ?? [],
                    subCategoriesLevelFour: categoryMapper(res.data?.subCategoriesLevelFour) ?? [],
                }
                setSubCategories(categoryMapper(res.data?.subCategories) ?? [])
                setSubCategoriesLevelTwo(categoryMapper(res.data?.subCategoriesLevelTwo) ?? [])
                setSubCategoriesLevelThree(categoryMapper(res.data?.subCategoriesLevelThree) ?? [])
                setSubCategoriesLevelFour(categoryMapper(res.data?.subCategoriesLevelFour) ?? [])
                setLoading(false)

            })
            .catch((error) => {
                console.log(error);
                setLoading(false)

            });
    }, []);


    const categoryMapper = (array = []) => {
        if (array.length > 0) {
            return array.map((cat) => {
                const data = {value: cat._id, label: cat.name};
                if (cat.mainCategoryId) {
                    data.mainCategoryId = cat.mainCategoryId;
                }
                return data;
            });
        }
        return [];
    };

    const handleChange = (e) => {
        setPageItem({
            ...pageItem,
            [e.target.name]: e.target.value,
        });
    };

    const handleDropDownChange = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_category: selectedOption.value,
            product_sub_category: null,
            product_sub_category_level_two: null,
            product_sub_category_level_three: null,
            product_sub_category_level_four: null
        });

        subList.current.subCategories.length > 0 && setSubCategories(subList.current.subCategories.filter(cat => cat?.mainCategoryId?._id === selectedOption.value))
        setSubCategoriesLevelTwo([])
        setSubCategoriesLevelThree([])
        setSubCategoriesLevelFour([])
    };

    const handleDropDownSubChange = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_sub_category: selectedOption.value,
            product_sub_category_level_two: null,
            product_sub_category_level_three: null,
            product_sub_category_level_four: null
        });
        subList.current.subCategoriesLevelTwo.length > 0 && setSubCategoriesLevelTwo(subList.current.subCategoriesLevelTwo.filter(cat => cat?.mainCategoryId?._id === selectedOption.value))
        setSubCategoriesLevelThree([])
        setSubCategoriesLevelFour([])
    };

    const handleDropDownSubChangeLevelTwo = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_sub_category_level_two: selectedOption.value,
            product_sub_category_level_three: null,
            product_sub_category_level_four: null
        });
        subList.current.subCategoriesLevelThree.length > 0 && setSubCategoriesLevelThree(subList.current.subCategoriesLevelThree.filter(cat => cat?.mainCategoryId?._id === selectedOption.value))
        setSubCategoriesLevelFour([])
    };

    const handleDropDownSubChangeLevelThree = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_sub_category_level_three: selectedOption.value,
            product_sub_category_level_four: null
        });
        subList.current.subCategoriesLevelFour.length > 0 && setSubCategoriesLevelFour(subList.current.subCategoriesLevelFour.filter(cat => cat?.mainCategoryId?._id === selectedOption.value))
    };

    const handleDropDownSubChangeLevelFour = (selectedOption) => {
        setPageItem({
            ...pageItem,
            product_sub_category_level_four: selectedOption.value,
        });
    };

    const handleCheck = (event) => {
        setPageItem({
            ...pageItem,
            online_sell: event.target.checked,
        });
    };

    const handleDiscountChange = (event) => {
        const discountamount = event.target.value
        setDiscount(discountamount)
        setPageItem({
            ...pageItem,
            discount: event.target.value,
        });
    }

    const handleUnitPrice = (event) => {

        const enteredAmount = (event.target.value);
        setAmount(enteredAmount);
        const calculatedPrice = enteredAmount - (enteredAmount * discount / 100);
        setPrice(calculatedPrice);
        setPageItem({
            ...pageItem,
            unit_price: enteredAmount,
            discounted_price: calculatedPrice,
        });


    };

    const handleDiscountPrice = (event) => {
        const enteredPrice = (event.target.value);
        setPrice(enteredPrice);
        const calculatedAmount = (enteredPrice * 100) / (100 - discount);
        setAmount(calculatedAmount);
        setPageItem({
            ...pageItem,
            discounted_price: event.target.value,
            unit_price: calculatedAmount,
        });

    };

    const handleReviewChange = (event) => {
        const enteredReview = parseInt(event.target.value);

        // Check if enteredReview is a number and within the range [1, 5]
        if (!isNaN(enteredReview)) {
            const reviewValue = Math.min(Math.max(enteredReview, 1), 5);
            setPageItem({
                ...pageItem,
                review: reviewValue,
            });
        }
    };


    console.log("render", {
        pageItem,
        categories,
        subList,
        subCategories,
        subCategoriesLevelTwo,
        subCategoriesLevelThree,
        subCategoriesLevelFour
    });
    console.log("filter", subCategoriesLevelTwo.find(
        (cat) => cat.value === pageItem.product_sub_category_level_two
    ));

    const editHistoryUpdate = (key) => {
        console.log(modelMode === "UPDATE" , pageItem[key] , editHistory.current[key])
        return pageItem[key] !== editHistory.current[key];

    }

    return (
        <div className="grid grid-cols-2 gap-6">
            {!loading ?
                <>
                    <div className="flex flex-col gap-4 border-">
                        <TextInput
                            label="Product Name"
                            border
                            borderColor={editHistoryUpdate("product_name") ? "border-green-600" :"border-gray-600"  }
                            name={"product_name"}
                            value={pageItem.product_name}
                            onChange={handleChange}
                        />

                        <Dropdown
                            label="Select Main category"
                            borderColor={editHistoryUpdate("product_category")?"green": null}
                            value={categories.find(
                                (cat) => cat.value === pageItem.product_category
                            ) ?? null}
                            options={categories}
                            onChange={handleDropDownChange}
                        />

                        <Dropdown
                            label="Select sub category"
                            borderColor={editHistoryUpdate("product_sub_category")?"green": null}
                            value={subCategories.find(
                                (cat) => cat.value === pageItem.product_sub_category
                            ) ?? null}
                            options={subCategories}
                            onChange={handleDropDownSubChange}
                        />

                        <Dropdown
                            label="Select sub category Level Two"
                            borderColor={editHistoryUpdate("product_sub_category_level_two")?"green": null}
                            value={subCategoriesLevelTwo.find(
                                (cat) => cat.value === pageItem.product_sub_category_level_two
                            ) ?? null}
                            options={subCategoriesLevelTwo}
                            onChange={handleDropDownSubChangeLevelTwo}
                        />

                        <Dropdown
                            label="Select sub category Level Three"
                            borderColor={editHistoryUpdate("product_sub_category_level_three")?"green": null}
                            value={subCategoriesLevelThree.find(
                                (cat) => cat.value === pageItem.product_sub_category_level_three
                            ) ?? null}
                            options={subCategoriesLevelThree}
                            onChange={handleDropDownSubChangeLevelThree}
                        />

                        <Dropdown
                            label="Select sub category Level Four"
                            borderColor={editHistoryUpdate("product_sub_category_level_four")?"green": null}
                            value={subCategoriesLevelFour.find(
                                (cat) => cat.value === pageItem.product_sub_category_level_four
                            ) ?? null}
                            options={subCategoriesLevelFour}
                            onChange={handleDropDownSubChangeLevelFour}
                        />

                        <Textarea
                            label="Description"
                            border
                            borderColor={editHistoryUpdate("product_description") ? "border-green-600" :"border-gray-600"  }
                            name={"product_description"}
                            value={pageItem.product_description}
                            onChange={handleChange}
                            maxLength="200"
                        />

                        <TextInput
                            label="Quantity"
                            type={"number"}
                            border
                            borderColor={editHistoryUpdate("quantity") ? "border-green-600" :"border-gray-600"  }
                            name={"quantity"}
                            value={pageItem.quantity}
                            onChange={handleChange}
                            min={1}
                        />

                        <TextInput
                            label="discount"
                            type="number"
                            border
                            borderColor={editHistoryUpdate("discount") ? "border-green-600" :"border-gray-600"  }
                            name="discount"
                            value={pageItem.discount}
                            onChange={handleDiscountChange}
                            min={1}
                        />

                        <TextInput
                            label="Unit price"
                            type={"number"}
                            border
                            borderColor={editHistoryUpdate("unit_price") ? "border-green-600" :"border-gray-600"  }
                            name={"unit_price"}
                            value={pageItem.unit_price}
                            onChange={handleUnitPrice}
                            min={1}
                        />


                        <TextInput
                            label="Discount price"
                            type={"number"}
                            border
                            borderColor={editHistoryUpdate("discounted_price") ? "border-green-600" :"border-gray-600"  }
                            name={"discount_price"}
                            value={pageItem.discounted_price}
                            onChange={handleDiscountPrice}
                            min={1}
                        />

                        <TextInput
                            label="brand"
                            border
                            borderColor={editHistoryUpdate("brand") ? "border-green-600" :"border-gray-600"  }
                            name="brand"
                            value={pageItem.brand}
                            onChange={handleChange}
                        />

                        <TextInput
                            label="skuNumber"
                            border
                            borderColor={editHistoryUpdate("skuNumber") ? "border-green-600" :"border-gray-600"  }
                            name="skuNumber"
                            value={pageItem.skuNumber}
                            onChange={handleChange}
                        />

                        <TextInput
                            label="type"
                            border
                            borderColor={editHistoryUpdate("type") ? "border-green-600" :"border-gray-600"  }
                            name="type"
                            value={pageItem.type}
                            onChange={handleChange}
                        />

                        <TextInput
                            label="mfgDate"
                            type={"date"}
                            max={new Date().toISOString().split("T")[0]}
                            border
                            borderColor={editHistoryUpdate("mfgDate") ? "border-green-600" :"border-gray-600"  }
                            name="mfgDate"
                            value={pageItem.mfgDate}
                            onChange={handleChange}
                        />

                        <TextInput
                            label="expDate"
                            type={"date"}
                            border
                            borderColor={editHistoryUpdate("expDate") ? "border-green-600" :"border-gray-600"  }
                            name="expDate"
                            value={pageItem.expDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                        />

                        <TextInput
                            label="review"
                            type="number"
                            min={1}
                            max={5}
                            border
                            borderColor={editHistoryUpdate("review") ? "border-green-600" :"border-gray-600"  }
                            name="review"
                            value={pageItem.review}
                            onChange={handleReviewChange}
                        />


                        <TextInput
                            label="life"
                            border
                            borderColor={editHistoryUpdate("life") ? "border-green-600" :"border-gray-600"  }
                            name="life"
                            value={pageItem.life}
                            onChange={handleChange}
                        />

                        <TextInput
                            label="popularity"
                            type="number"
                            border
                            borderColor={editHistoryUpdate("popularity") ? "border-green-600" :"border-gray-600"  }
                            name="popularity"
                            value={pageItem.popularity}
                            onChange={handleChange}
                            min={1}
                        />

                        <div className="flex items-center justify-start gap-2">
                            <label
                                htmlFor="checkbox"
                                className={`text-sm font-medium ${editHistoryUpdate("online_sell") ? "text-green-600" :"text-gray-900"}`}
                            >
                                Selling online
                            </label>

                            <input
                                id="checkbox"
                                type="checkbox"
                                checked={pageItem.online_sell}
                                onChange={handleCheck}
                            />
                        </div>
                    </div>

                    <div className="self-start sticky top-0">
                        <img
                            src={pageItem.product_image}
                            alt=""
                            className="w-full h-full h-[30vw] object-contain"
                        />
                    </div>
                </> : <div className="h-[100vh]"><p>Loading...</p></div>}
        </div>
    );
};


export default Form;