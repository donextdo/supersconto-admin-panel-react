import React, { useState, useEffect, useRef } from "react";
import { Content, Card } from "../components/shared/Utils";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Table, THead, TBody, TH, Row, TD } from "../components/shared/Table";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { RiAddCircleLine } from "react-icons/ri";
import { ButtonNormal } from "../components/shared/Button";
import Modal from "../components/shared/Modal";
import TextInput from "../components/shared/TextInput";
import baseUrl from "../utils/baseUrl";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "../components/shared/Dropdown";
import Confirm from "../components/shared/Confirm";
import { PencilAltIcon } from "@heroicons/react/solid";

const SubCategoryLevel3 = () => {
  const [isEdit, setIsEdit] = useState(false);
  let [options, setOptions] = useState([]);
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const [categoryId, setCategoryId] = useState();
  const [formData, setFormData] = useState({
    name: null,
    mainCategoryName: null,
  });
  const [selected, setSelected] = useState([]);
  const onDelete = (id) => {
    sessionStorage.setItem("id", id);
    setConfirm(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categories = [];
      const res = await axios.get(baseUrl + "/category/categories");
      console.log("res : ", res.data.subCategories);
      setOptions([]);
      setData(res.data.subCategoriesLevelThree);
      res.data.subCategoriesLevelTwo.forEach(assign);
      function assign(val) {
        categories.push(val);

        if (!options.includes({ value: val.name, label: val.name })) {
          setOptions((prevItems) => [
            ...prevItems,
            { value: val.name, label: val.name },
          ]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const toggleModal = () => {
    setModal(!modal);
  };
  const onCancel = () => {
    setModal(!modal);
  };

  const updateSelect = async (option) => {
    setSelected(option);
    const res = await axios.get(baseUrl + "/category/categories");

    const selectedMainCategory = res.data.subCategoriesLevelTwo.find(
      (category) => category.name === option.value
    );
    if (selectedMainCategory) {
      setCategoryId(selectedMainCategory?.name);
    } else {
      console.log("null");
    }
  };

  const update = (e, categoryId) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        ["name"]: e.target.value,
      };
    });
  };
  const onUpdate = async () => {};

  const toUpdate = (data) => {
    setIsEdit(true);
    sessionStorage.setItem("id", data._id);
    setModal(!modal);
    setFormData((prevState) => {
      return { ...prevState, ["name"]: data.name };
    });
  };

  const onSave = async () => {
    await axios({
      method: "post",
      url: `${baseUrl}/category/sub-categories-level-three`,
      data: formData,
    })
      .then((response) => {
        setAlertError(false);
        toggleModal();

        console.log("sub: ", response.data);
        fetchData();
        return toast.success("Data inserted successfully");
      })
      .catch(function (error) {
        console.log(error);
        toggleModal();

        return toast.error(error.message);
      });
  };

  useEffect(() => {
    setFormData((prevState) => {
      return {
        ...prevState,
        ["mainCategoryName"]: categoryId,
      };
    });
  }, [selected, categoryId]);

  return (
    <div>
      <>
        <ToastContainer />
        {confirm && (
          <Confirm
            // onSave={toDelete}
            onCancel={() => setConfirm(false)}
            onClose={() => setConfirm(false)}
          ></Confirm>
        )}
        {modal && (
          <Modal
            onClose={toggleModal}
            onCancel={onCancel}
            onSave={isEdit ? onUpdate : onSave}
            title="Categories"
            width="w-1/2"
            height="h-2/3"
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <Dropdown
                  label="Main Category"
                  border
                  value={selected}
                  borderColor="border-gray-600"
                  options={options}
                  onChange={updateSelect}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <TextInput
                  label="Sub Category/Category Name"
                  border
                  borderColor="border-gray-600"
                  value={formData.name}
                  onChange={(e) => update(e)}
                />
              </div>
            </div>
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
              <TH title={"Name"} />
              <TH width={"w-[20px]"} title={"Actions"} />
            </THead>

            <TBody>
              {data.map((d) => {
                return (
                  <Row key={d._id}>
                    <TD>{d.name}</TD>
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
export default SubCategoryLevel3;
