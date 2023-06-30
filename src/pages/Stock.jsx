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
      const { data } = await axios.get(`${baseUrl}/stock`);
      setStockData(data);

      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchShops() {
    try {
      const res = await axios.get(`${baseUrl}/shop`);
      const shopData = res?.data.map((d) => {
        return {
          value: d._id,
          label: `${d.shop_name} - ${d.address.address_line1}, ${d.address.city}`,
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

        <Table>
          <THead>
            <TH title={"ID"} />
            <TH title={"Item Name"} />
            <TH title={"Shop Name"} />
            <TH title={"Shop City"} />
            <TH title={"Shop Address"} />
            <TH title={"Unit Price"} />
            <TH title={"Total QTY"} />
            <TH title={"Remaining QTY"} />
          </THead>

          <TBody>
            {stockData.map((stock) => {
              return (
                <Row key={stock._id}>
                  <TD>{stock._id}</TD>

                  <TD>{stock.product_name}</TD>

                  <TD>{stock.shop_id?.shop_name}</TD>
                  <TD>{stock?.shop_id?.address.city}</TD>
                  <TD>{`${stock.shop_id?.address.address}`}</TD>
                  <TD>{stock.unit_price}</TD>
                  <TD>{stock.quantity}</TD>
                  <TD>{stock.remaining_qty}</TD>
                </Row>
              );
            })}
          </TBody>
        </Table>
      </Card>

      {/* </Content> */}
    </div>
  );
};

export default Stocks;
