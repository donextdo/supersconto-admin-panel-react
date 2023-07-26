import React, { useState, useEffect } from "react";
import { Content, Card } from "../components/shared/Utils";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Table, THead, TBody, TH, Row, TD } from "../components/shared/Table";
import axios from "axios";
import { ButtonSuccess, ButtonNormal } from "../components/shared/Button";
import { FcClearFilters } from "react-icons/fc";
import baseUrl from "../utils/baseUrl";
import Dropdown from "../components/shared/Dropdown";
import { FaTrash, FaSearch } from "react-icons/fa";
import { PencilAltIcon } from "@heroicons/react/solid";
import { FaRegHandPointRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import TextInput from "../components/shared/TextInput"
import Textarea from "../components/shared/Textarea";

const Order = () => {
  const [selected, setSelected] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [modal, setModal] = useState(false);
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState(null);
  const [showProduct, setShowProduct] = useState(false);
  const [pId, setPId] = useState('');
  let [options, setOptions] = useState([
    { value: "Processing", label: "Processing" },
    { value: "New", label: "New" },
    { value: "Delivered", label: "Delivered" },
    { value: "Rejected", label: "Rejected" },
  ]);
  const [productArray, setProductArray] = useState([])

  useEffect(() => {
    fetchData();
    fetchShops();
  }, []);

  const updateSelect = (option) => {
    setSelected(option);
  };

  async function fetchData() {
    try {
      const { data } = await axios.get(`${baseUrl}/neworder`);
      setOrderData(data);
      console.log("status : ", data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchDataProduct()
  }, [pId])

  async function fetchDataProduct() {
    try {
      const res = await axios.get(`${baseUrl}/catelog/item/find/${pId}`)
      console.log(res.data)
      const data = res.data;
      setProductArray(data)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchShops() {
    try {
      const res = await axios.get(`${baseUrl}/shop`);
      const shopData = res?.data.map((d) => {
        return {
          value: d._id,
          label: d.shop_name,
        };
      });
      setShops(shopData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDropDownChange = async (selectedOption) => {
    try {
      const shop = selectedOption.value;
      setFilter(shop);
      const { data } = await axios.post(`${baseUrl}/order/by-shop`, {
        shop,
      });

      setOrderData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const clearFilter = async () => {
    await fetchData();
    setFilter(null);
  };

  const onSave = () => {
    alert("onsave clicked");
  };

  const onCancel = () => {
    setModal(false);
  };

  //view Order

  const [openViewModal, setOpenViewModal] = useState(false);

  const [groupedItems, setGroupedItems] = useState({}); // Define groupedItems state
  const [shopTables, setShopTables] = useState([]); // Define shopTables state
  const [user, setUser] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "processing", label: "Processing" },
    { value: "delivered", label: "Delivered" },
    { value: "rejected", label: "Rejected" },
  ];

  const toView = async (order) => {
    setOpenViewModal(true);
    setUser(order.billingAddress);
    setOrderId(order._id);
    setSelected({ value: order.status, label: order.status });

    const groupedItemsData = order.items.reduce((acc, item) => {
      const shopId = item.shopId;
      if (acc[shopId]) {
        acc[shopId].push(item);
      } else {
        acc[shopId] = [item];
      }
      return acc;
    }, {});

    setGroupedItems(groupedItemsData); // Update groupedItems state

    renderShopTables(groupedItemsData); // Render shop tables
  };

  const updateStatus = async () => {
    try {
      const response = await axios.put(`${baseUrl}/neworder/${orderId}`, {
        status: selected.value, // Assuming the selected value represents the new status
      });
      // if (response && selected.value === "delivered") {
      //   console.log("dgyagu");
      //   console.log("dgyaguyyyyyyyyyyyyyyyyyyy");
      //   const payload = Object.values(groupedItems).flatMap((items) =>
      //     items.map((item) => ({
      //       productId: item.productId,
      //       orderquantity: item.orderquantity,
      //     }))
      //   );
      //   console.log("payload : ", payload);
      //   const updateResponse = await axios.patch(
      //     `${baseUrl}/catelog/item/update/quentity`,
      //     payload
      //   );
      //   console.log("updateResponse:", updateResponse);
      //   setOpenViewModal(false);
      //   window.location.reload();
      // }
      setOpenViewModal(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getShopName = async (shopId) => {
    console.log(shopId)
    try {
      const response = await axios.get(`${baseUrl}/shop/find/${shopId}`);
      return response.data.shop_name;
    } catch (error) {
      console.log(error);
    }
  };

  const getShopAddress = async (shopId) => {
    console.log(shopId)
    try {
      const response = await axios.get(`${baseUrl}/shop/find/${shopId}`);
      return response.data.address.address;
    } catch (error) {
      console.log(error);
    }
  };


  const getProductName = async (prodId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/catelog/item/find/${prodId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryName = async (catId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/category/categories/${catId}`
      );
      return response.data.name;
    } catch (error) {
      console.log(error);
    }
  };
  const subCatName = async (catId) => {
    try {
      const response = await axios.get(
        `${baseUrl}/category/subcategories/${catId}`
      );
      return response.data.name;
    } catch (error) {
      console.log(error);
    }
  };

  const renderShopTables = async (groupedItemsData) => {
    const tables = await Promise.all(
      Object.entries(groupedItemsData).map(async ([shopId, items]) => {
        console.log(items)
        const shopName = await getShopName(shopId);
        const shopAddress = await getShopAddress(shopId);
        const productPromises = items.map(async (order) => {
          const productName = await getProductName(order.productId);
          const categoryName = await getCategoryName(
            productName.product_category
          );
          const subCategoryName = await subCatName(
            productName.product_sub_category
          );
          return { ...order, productName, categoryName, subCategoryName };
        });
        const products = await Promise.all(productPromises);


        console.log(products)

        const productViewmodal = (id) => {
          setShowProduct(!showProduct)
          console.log(id)
          setPId(id)
        }

        return (
          <div>
            <Card key={shopId}>
              <div className="w-full py-4 flex gap-6"></div>
              {/* <h3>Shop ID: {shopId}</h3> */}
              <h3 className="text-white text-2xl font-bold p-2 border border-green-500 bg-green-500">
                {shopName} - {shopAddress}
              </h3>
              <Table>
                <THead>
                  <TH title={"Product Name"} />
                  <TH title={"Quantity"} />
                  <TH title={"Catergory"} />
                  <TH title={"Sub-Catergory"} />
                  <TH title={"View"} />
                </THead>
                <TBody>
                  {products.map((order) => (
                    <Row key={order.productId}>
                      <TD>{order.productName.product_name}</TD>
                      <TD>{order.orderquantity}</TD>
                      <TD>{order.categoryName}</TD>

                      <TD>{order.subCategoryName}</TD>
                      <TD>
                        <div className="w-full h-full flex items-center justify-center gap-4">
                          <FaSearch
                            onClick={() => productViewmodal(order.productId)}
                            className="w-4 h-4 fill-green-500 cursor-pointer"
                          />
                        </div>
                      </TD>
                    </Row>
                  ))}
                </TBody>
              </Table>
            </Card>


          </div>
        );
      })
    );
    setShopTables(tables); // Update shopTables state
  };

  const handleclose = () => {
    setOpenViewModal(false);
  };
  const categorizedData = orderData.reduce((acc, order) => {
    const OrderName = order.billingAddress.billingFirstName + ", " + `${order.billingAddress.apartment}, ${order.billingAddress.street}, ${order.billingAddress.state}, ${order.billingAddress.town}`

    // If the shop category doesn't exist, create a new array for it
    if (!acc[OrderName]) {
      acc[OrderName] = [];
    }

    // Push the order item into the corresponding shop category array
    acc[OrderName].push(order);

    return acc;
  }, {});

  const handleCloseProduct = () => {
    setShowProduct(!showProduct)
  }


  return (
    <div>
      <Card>
        <div className="w-full py-4 flex gap-6"></div>

        {Object.entries(categorizedData).map(([OrderName, orders]) => (
          <div key={OrderName}>
            <h3 className="h-10 w-full bg-green-100 mt-4 p-1">{OrderName}</h3>
            <Table>
              <THead>
                <TH title={"Order Id"} />
                <TH title={"Date"} />
                <TH title={"Customer Name"} />

                <TH title={"Billing Address"} />
                <TH title={"Payment method"} />
                <TH title={"Status"} />
                <TH title={"Total Price"} />
                <TH title={"Actions"} />
              </THead>

              <TBody>
                {orders.map((order) => {
                  return (
                    <Row key={order._id}>
                      <TD>{order.orderNumber}</TD>
                      <TD>{order.date}</TD>

                      <TD>{order.billingAddress.billingFirstName}</TD>

                      <TD>
                        {`${order.billingAddress.apartment}, ${order.billingAddress.street}, ${order.billingAddress.state}, ${order.billingAddress.town}`}
                      </TD>

                      <TD>CASH ON DELIVERY</TD>
                      <TD>{order.status}</TD>
                      <TD>{order.totalprice}</TD>

                      {/* <TD>{order.paymentMethod}</TD> */}
                      <TD>
                        <div className="w-full h-full flex items-center justify-center gap-4">
                          <FaSearch
                            onClick={() => toView(order)}
                            className="w-4 h-4 fill-green-500 cursor-pointer"
                          />
                          {/* <PencilAltIcon
                            onClick={() => toUpdate(order)}
                            className="w-4 h-4 fill-blue-500 cursor-pointer"
                          />
                          <FaTrash
                            onClick={() => onDelete(order._id)}
                            className="w-3 h-3 fill-red-500 cursor-pointer"
                          /> */}
                        </div>
                      </TD>
                    </Row>
                  );
                })}
              </TBody>
            </Table>
          </div>
        ))}
      </Card>
      {openViewModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900 bg-opacity-50">
          <div className="flex gap-6 flex-col relative rounded-md w-full lg:w-[1024px] h-[700px] bg-white">
            <div className="flex justify-end px-2">
              <button
                onClick={handleclose}
                className="w-8 h-8 flex justify-center items-center"
              >
                <IoClose className="text-black mt-3" />
              </button>
            </div>
            <div className="overflow-y-scroll h-[600px]">
              <div className="flex justify-between px-6 ">
                <div className="w-[250px]">
                  <Select
                    options={statusOptions}
                    value={selected}
                    onChange={updateSelect}
                  />
                </div>
                <div>
                  <p className="text-gray-500 font-semibold text-lg">Customer Address</p>
                  <div className="w-[100px] h-[100px] ">

                    {user.billingFirstName}
                    <br />
                    {user.apartment}
                    <br />
                    {user.state}
                    <br />
                    {user.street}
                    <br />
                    {user.town}
                  </div>
                </div>
              </div>
              {shopTables}
              <div className="bg-green-700 w-[200px] h-[50px] ml-6 mt-6 flex justify-items-center rounded-full">
                <button
                  className="text-white font-semibold text-[20px] ml-8"
                  onClick={updateStatus}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProduct && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900 bg-opacity-50">
          <div className="flex gap-6 flex-col relative rounded-md w-full lg:w-[1024px] h-[700px] bg-white overflow-y-auto">

            <div className="flex justify-end px-2">
              <button
                onClick={handleCloseProduct}
                className="w-8 h-8 flex justify-center items-center"
              >
                <IoClose className="text-black mt-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 px-4 pb-4">
              <div className="flex flex-col gap-4">
                <TextInput
                  label="Product Name"
                  border
                  borderColor="border-gray-600"
                  name={"product_name"}
                  value={productArray.product_name}
                />
                <TextInput
                  label="Main category"
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.product_category}
                />
                <TextInput
                  label="sub category"
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.product_sub_category}
                />
                <TextInput
                  label="Sub category Level Two"
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.product_sub_category_level_two}
                />
                <TextInput
                  label="Sub category Level Three"
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.product_sub_category_level_three}
                />
                <TextInput
                  label="Quantity"
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.quantity}
                />
                <Textarea
                  label="Description"
                  border
                  borderColor="border-gray-600"
                  name={"product_description"}
                  value={productArray.product_description}
                />

                <TextInput
                  label="Quantity"
                  type={"number"}
                  border
                  borderColor="border-gray-600"
                  name={"quantity"}
                  value={productArray.quantity}
                />

                <TextInput
                  label="Unit price"
                  border
                  borderColor="border-gray-600"
                  name={"unit_price"}
                  value={productArray.unit_price}
                />

                <TextInput
                  label="discount"
                  border
                  borderColor="border-gray-600"
                  name="discount"
                  value={productArray.discount}
                />
                <TextInput
                  label="Discount price"
                  border
                  borderColor="border-gray-600"
                  name={"discount_price"}
                  value={productArray.discounted_price}
                />
                <TextInput
                  label="brand"
                  border
                  borderColor="border-gray-600"
                  name="brand"
                  value={productArray.brand}
                />

                <TextInput
                  label="skuNumber"
                  border
                  borderColor="border-gray-600"
                  name="skuNumber"
                  value={productArray.skuNumber}
                />

                <TextInput
                  label="type"
                  border
                  borderColor="border-gray-600"
                  name="type"
                  value={productArray.type}
                />

                <TextInput
                  label="mfgDate"
                  border
                  borderColor="border-gray-600"
                  name="mfgDate"
                  value={productArray.mfgDate}
                />

                <TextInput
                  label="expDate"
                  border
                  borderColor="border-gray-600"
                  name="expDate"
                  value={productArray.expDate}
                />

                <TextInput
                  label="review"
                  type="number"
                  border
                  borderColor="border-gray-600"
                  name="review"
                  value={productArray.review}
                />

              </div>
            </div>
          </div>
        </div>
      )}

      {/* </Content> */}
    </div>
  );
};
export default Order;
