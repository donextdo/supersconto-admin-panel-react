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
import { ToastContainer, toast } from "react-toastify";
const userData = sessionStorage.getItem("user") ? JSON.parse(atob(sessionStorage.getItem("user"))) : null
const token = localStorage.getItem("token") ? localStorage.getItem("token") : null
const Stocks = () => {
  const [stockData, setStockData] = useState([]);
  const [modal, setModal] = useState(false);
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    fetchData();
    fetchShops();
  }, []);

  async function fetchData() {
    try {
      let res = []

      if (userData){
        if (userData?.userType === 0) {
          res = await axios.get(`${baseUrl}/stock`);
        } else {
          res = await axios.get(`${baseUrl}/stock/filter-by-vendor/${userData?._id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${token}`,
              'Accept': "application/json"
            }
          });
        }
      }
      setStockData(res.data);

    } catch (error) {
      console.log(error);
    }
  }

  async function fetchShops() {
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
      const shopData = res?.data.map((d) => {
        return {
          value: d._id,
          label: `${d.shop_name} - ${d.address.address}`,
        };
      });
      setShops(shopData);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDropDownChange = async (selectedOption) => {
    try {
      const shop = selectedOption.value;
      setFilter(shop);
      const { data } = await axios.post(`${baseUrl}/stock/filter-by-shop`, {
        shop,
      });
      console.log(data);

      setStockData(data);
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

  const categorizedData = stockData.reduce((acc, stock) => {
    const shopName = stock.shop_id?.shop_name + ", " + stock.shop_id?.address.address;
    
    // If the shop category doesn't exist, create a new array for it
    if (!acc[shopName]) {
      acc[shopName] = [];
    }

    // Push the stock item into the corresponding shop category array
    acc[shopName].push(stock);

    return acc;
  }, {});

  return (
    <div>
      {/* <Sidebar />
      <Navbar />

      <Content> */}
      <ToastContainer />
      <Card>
        <div className="w-full py-4 flex gap-6">
          <div className="flex w-3/5">
            <div className="py-2 px-3 whitespace-nowrap bg-gray-600 text-white text-sm font-medium">
              Filter by shop
            </div>

            <div className="w-full">
              <Dropdown options={shops} onChange={handleDropDownChange} />
            </div>
          </div>

          <ButtonNormal onClick={clearFilter} disabled={!filter}>
            <FcClearFilters className="w-5 h-5" />
            <span>Clear Filter</span>
          </ButtonNormal>
        </div>
        {Object.entries(categorizedData).map(([shopName, stocks]) => (
        <div key={shopName}>
          <h3 className="h-10 w-full bg-green-100 mt-4 p-1">{shopName}</h3>
        <Table>
          <THead>
            <TH title={"ID"} />
            <TH title={"Item Name"} />
            <TH title={"Shop Name"} />
            <TH title={"Shop Address"} />
            <TH title={"Unit Price"} />
            <TH title={"Total QTY"} />
            <TH title={"Remaining QTY"} />
          </THead>

          <TBody>
            {stocks.map((stock) => {
              return (
                <Row key={stock._id}>
                  <TD>{stock._id}</TD>

                  <TD>{stock.product_name}</TD>

                  <TD>{stock.shop_id?.shop_name}</TD>
                  <TD>{`${stock.shop_id?.address.address}`}</TD>
                  <TD>{stock.unit_price}</TD>
                  <TD>{stock.quantity}</TD>
                  <TD>{stock.remaining_qty}</TD>
                </Row>
              );
            })}
          </TBody>
        </Table>
        </div>
      ))}
      </Card>

      {/* </Content> */}
    </div>
  );
};

export default Stocks;
