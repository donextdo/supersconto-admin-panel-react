import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import TextInput from "../shared/TextInput";
import Dropdown from "../shared/Dropdown";
import Textarea from "../shared/Textarea";
import baseUrl from "../../utils/baseUrl.js";

const Form = ({ pageItem, setPageItem }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [categories, setCategories] = useState([]);
  const subList = useRef([]);
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0); // Default discount of 10%
  const [price, setPrice] = useState(0);

  const subListLevelTwo = useRef([]);
  const subListLevelThree = useRef([]);
  const subListLevelFour = useRef([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoriesLevelTwo, setSubCategoriesLevelTwo] = useState([]);
  const [subCategoriesLevelThree, setSubCategoriesLevelThree] = useState([]);
  const [subCategoriesLevelFour, setSubCategoriesLevelFour] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/category/categories`)
      .then((res) => {
        console.log({ res });
        setCategories(categoryMapper(res.data?.mainCategories) ?? []);
        setSubCategories(categoryMapper(res.data?.subCategories) ?? []);
        setSubCategoriesLevelTwo(
          categoryMapper(res.data?.subCategoriesLevelTwo) ?? []
        );
        setSubCategoriesLevelThree(
          categoryMapper(res.data?.subCategoriesLevelThree) ?? []
        );
        setSubCategoriesLevelFour(
          categoryMapper(res.data?.subCategoriesLevelFour) ?? []
        );
        subList.current = categoryMapper(res.data?.subCategories) ?? [];
        subListLevelTwo.current =
          categoryMapper(res.data?.subCategoriesLevelTwo) ?? [];
        subListLevelThree.current =
          categoryMapper(res.data?.subCategoriesLevelThree) ?? [];
        subListLevelFour.current =
          categoryMapper(res.data?.subCategoriesLevelFour) ?? [];
      })
      .catch((error) => {
        // TODO
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filteredSubCats =
      subList.current.filter(
        (sub) => sub.mainCategoryId === pageItem.product_category
      ) ?? [];
    setSubCategories(filteredSubCats);

    const filteredSubCatsLevelTwo =
      subListLevelTwo.current.filter(
        (sub) => sub.mainCategoryId === pageItem.product_sub_category
      ) ?? [];
    setSubCategoriesLevelTwo(filteredSubCatsLevelTwo);

    const filteredSubCatsLevelThree =
      subListLevelThree.current.filter(
        (sub) => sub.mainCategoryId === pageItem.product_sub_category_level_two
      ) ?? [];
    setSubCategoriesLevelThree(filteredSubCatsLevelThree);

    const filteredSubCatsLevelFour =
      subListLevelFour.current.filter(
        (sub) =>
          sub.mainCategoryId === pageItem.product_sub_category_level_three
      ) ?? [];
    setSubCategoriesLevelFour(filteredSubCatsLevelFour);

    console.log("eff", { pageItem, filteredSubCats, ref: subList.current });
  }, [pageItem]);

  const categoryMapper = (array = []) => {
    if (array.length > 0) {
      return array.map((cat) => {
        const data = { value: cat._id, label: cat.name };
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
    });
  };

  const handleDropDownSubChange = (selectedOption) => {
    setPageItem({
      ...pageItem,
      product_sub_category: selectedOption.value,
    });
  };

  const handleDropDownSubChangeLevelTwo = (selectedOption) => {
    setPageItem({
      ...pageItem,
      product_sub_category_level_two: selectedOption.value,
    });
  };

  const handleDropDownSubChangeLevelThree = (selectedOption) => {
    setPageItem({
      ...pageItem,
      product_sub_category_level_three: selectedOption.value,
    });
  };

  const handleDropDownSubChangeLevelFour = (selectedOption) => {
    setPageItem({
      ...pageItem,
      product_description_level_four: selectedOption.value,
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
    const calculatedPrice = enteredAmount - (enteredAmount*discount/100);
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
    const calculatedAmount = (enteredPrice * 100)/(100-discount);
    setAmount(calculatedAmount);
    setPageItem({
      ...pageItem,
      discounted_price: event.target.value,
      unit_price: calculatedAmount,
    });
    
  };

  console.log("render", { pageItem });
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <TextInput
          label="Product Name"
          border
          borderColor="border-gray-600"
          name={"product_name"}
          value={pageItem.product_name}
          onChange={handleChange}
        />

        <Dropdown
          label="Select Main category"
          defaultValue={categories.find(
            (cat) => cat.value === pageItem.product_category
          )}
          value={categories.find(
            (cat) => cat.value === pageItem.product_category
          )}
          options={categories}
          onChange={handleDropDownChange}
        />

        <Dropdown
          label="Select sub category"
          defaultValue={subCategories.find(
            (cat) => cat.value === pageItem.product_sub_category
          )}
          value={subCategories.find(
            (cat) => cat.value === pageItem.product_sub_category
          )}
          options={subCategories}
          onChange={handleDropDownSubChange}
        />

        <Dropdown
          label="Select sub category Level Two"
          defaultValue={subCategoriesLevelTwo.find(
            (cat) => cat.value === pageItem.product_sub_category_level_two
          )}
          value={subCategoriesLevelTwo.find(
            (cat) => cat.value === pageItem.product_sub_category_level_two
          )}
          options={subCategoriesLevelTwo}
          onChange={handleDropDownSubChangeLevelTwo}
        />

        <Dropdown
          label="Select sub category Level Three"
          defaultValue={subCategoriesLevelThree.find(
            (cat) => cat.value === pageItem.product_sub_category_level_three
          )}
          value={subCategoriesLevelThree.find(
            (cat) => cat.value === pageItem.product_sub_category_level_three
          )}
          options={subCategoriesLevelThree}
          onChange={handleDropDownSubChangeLevelThree}
        />

        <Dropdown
          label="Select sub category Level Four"
          defaultValue={subCategoriesLevelFour.find(
            (cat) => cat.value === pageItem.product_description_level_four
          )}
          value={subCategoriesLevelFour.find(
            (cat) => cat.value === pageItem.product_description_level_four
          )}
          options={subCategoriesLevelFour}
          onChange={handleDropDownSubChangeLevelFour}
        />

        <Textarea
          label="Description"
          border
          borderColor="border-gray-600"
          name={"product_description"}
          value={pageItem.product_description}
          onChange={handleChange}
          maxlength="200"
        />

        <TextInput
          label="Quantity"
          type={"number"}
          border
          borderColor="border-gray-600"
          name={"quantity"}
          value={pageItem.quantity}
          onChange={handleChange}
        />

        <TextInput
          label="Unit price"
          type={"number"}
          border
          borderColor="border-gray-600"
          name={"unit_price"}
          value={amount}
          onChange={handleUnitPrice}
        />

        <TextInput
          label="discount"
          type="number"
          border
          borderColor="border-gray-600"
          name="discount"
          value={pageItem.discount}
          onChange={handleDiscountChange}
        />

        <TextInput
          label="Discount price"
          type={"number"}
          border
          borderColor="border-gray-600"
          name={"discount_price"}
          value={price}
          onChange={handleDiscountPrice}
        />

        <TextInput
          label="brand"
          border
          borderColor="border-gray-600"
          name="brand"
          value={pageItem.brand}
          onChange={handleChange}
        />

        <TextInput
          label="skuNumber"
          border
          borderColor="border-gray-600"
          name="skuNumber"
          value={pageItem.skuNumber}
          onChange={handleChange}
        />

        <TextInput
          label="type"
          border
          borderColor="border-gray-600"
          name="type"
          value={pageItem.type}
          onChange={handleChange}
        />

        <TextInput
          label="mfgDate"
          border
          borderColor="border-gray-600"
          name="mfgDate"
          value={pageItem.mfgDate}
          onChange={handleChange}
        />

        <TextInput
          label="expDate"
          border
          borderColor="border-gray-600"
          name="expDate"
          value={pageItem.expDate}
          onChange={handleChange}
        />



        <TextInput
          label="review"
          type="number"
          max={5}
          border
          borderColor="border-gray-600"
          name="review"
          value={pageItem.review}
          onChange={handleChange}
        />

        <TextInput
          label="life"
          border
          borderColor="border-gray-600"
          name="life"
          value={pageItem.life}
          onChange={handleChange}
        />

        <TextInput
          label="popularity"
          type="number"
          border
          borderColor="border-gray-600"
          name="popularity"
          value={pageItem.popularity}
          onChange={handleChange}
        />

        <div className="flex items-center justify-start gap-2">
          <label
            htmlFor="checkbox"
            className="text-sm font-medium text-gray-900"
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

      <div>
        <img
          src={pageItem.product_image}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Form;
