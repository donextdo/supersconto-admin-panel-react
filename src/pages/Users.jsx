import { Content, Card } from "../components/shared/Utils";
import Navbar from "../components/shared/Navbar";
import Sidebar from "../components/shared/Sidebar";
import { Table, THead, TBody, TH, Row, TD } from "../components/shared/Table";
import { FaTrash } from "react-icons/fa";
import { PencilAltIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost/user.php");
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const onSave = () => {
    alert("onsave clicked");
  };

  const onCancel = () => {
    setModal(!modal);
  };

  return (
    <div>
      {/* <Sidebar />
      <Navbar />

      <Content> */}
        <Card>
          <Table>
            <THead>
              <TH title={"Id"} />
              <TH title={"Name"} />
              <TH title={"Email"} />
              <TH title={"Contact"} />
              <TH title={"Register date"} />
              <TH title={"Actions"} />
            </THead>

            <TBody>
              {data.map((d) => {
                return (
                  <Row key={d.id}>
                    <TD>{d.id}</TD>
                    <TD>{d.name}</TD>
                    <TD>{d.email}</TD>
                    <TD>{d.mobile}</TD>
                    <TD>{d.registerDate}</TD>
                    <TD>
                      <div className="w-full h-full flex items-center justify-center gap-4">
                        <FaTrash className="w-3 h-3 fill-red-500 cursor-pointer" />
                        <PencilAltIcon className="w-4 h-4 fill-blue-500 cursor-pointer" />
                      </div>
                    </TD>
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

export default Users;
