// required imports
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscEdit } from "react-icons/vsc";
import DownloadButton from "./DownloadButton";
import {
  AiOutlinePlus,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai";

// interface for each user data
export interface DataInterface {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  role: string;
  status: string;
  img: number;
  loginTime: string;
  loginDate: string;
}

// interface for styling of status badge
interface StatusBadgeInterface {
  status: string;
}

// formElement for getting details from modal
type FormElements = {
  firstName?: HTMLInputElement;
  lastName?: HTMLInputElement;
  role?: HTMLInputElement;
  status?: HTMLInputElement;
  email?: HTMLInputElement;
};

// user data api
const url = "https://api-npyv.onrender.com/users";

function DisplayData() {
  // all state variables
  const [clientData, setClientData] = useState<DataInterface[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [tempId, setTempId] = useState<string>("");
  const [userData, setUserData] = useState<DataInterface>();
  const [flagForSorting, setFlagForSorting] = useState<boolean>(false);

  // getting user data
  const handleGetUser = async () => {
    const response = await fetch(`${url}`);
    const data = await response.json();
    setClientData(data);
  };

  // handling delete user data request
  const handleDeleteRequest = async (id: string) => {
    await fetch(`${url}/${id}`, {
      method: "DELETE",
    });
    handleGetUser();
  };

  // loading user data from server
  useEffect(() => {
    handleGetUser();
  }, []);

  // sending edited or new user data
  const handleModalData = async (
    e: React.FormEvent<HTMLFormElement>,
    id = tempId
  ) => {
    e.preventDefault();
    setRandomNumber(Math.floor(Math.random() * 4) + 1);
    const hook = e.currentTarget.elements as FormElements;
    console.log("Id->", id);
    console.log("tempId->", tempId);
    console.log("after fetching->", userData);
    if (
      hook.firstName != undefined &&
      hook.lastName != undefined &&
      hook.status != undefined &&
      hook.role != undefined &&
      hook.email != undefined
    ) {
      const upperCaseFirstName =
        hook.firstName.value.charAt(0).toUpperCase() +
        hook.firstName.value.slice(1);
      const upperCaseLastName =
        hook.lastName.value.charAt(0).toUpperCase() +
        hook.lastName.value.slice(1);
      const upperCaseStatus =
        hook.status.value.charAt(0).toUpperCase() + hook.status.value.slice(1);
      const upperCaseRole =
        hook.role.value.charAt(0).toUpperCase() + hook.role.value.slice(1);
      const today = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const date =
        monthNames[today.getMonth()] +
        " " +
        today.getDate() +
        ", " +
        today.getFullYear();
      const time =
        today.getHours() +
        ":" +
        (today.getMinutes() < 10
          ? "0" + today.getMinutes()
          : today.getMinutes());

      if (id === "") {
        const uploadData: DataInterface = {
          firstName: upperCaseFirstName ?? "",
          lastName: upperCaseLastName ?? "",
          role: upperCaseRole ?? "",
          status: upperCaseStatus ?? "",
          email: hook.email.value ?? "",
          id: uuidv4(),
          img: randomNumber,
          loginDate: date,
          loginTime: time,
        };
        const handlePostRequest = async (data: DataInterface) => {
          setShowModal((prev) => !prev);
          await fetch(`${url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((data) => data.json())
            .catch((error) => console.log(error));
        };
        handlePostRequest(uploadData);
        setShowModal(false);
        setTimeout(() => {
          handleGetUser();
        }, 1250);
      } else {
        const uploadData: DataInterface = {
          firstName: upperCaseFirstName
            ? upperCaseFirstName
            : userData?.firstName
            ? userData.firstName
            : "",
          lastName: upperCaseLastName
            ? upperCaseLastName
            : userData?.lastName
            ? userData.lastName
            : "",
          role: upperCaseRole
            ? upperCaseRole
            : userData?.role
            ? userData.role
            : "",
          status: upperCaseStatus
            ? upperCaseStatus
            : userData?.status
            ? userData?.status
            : "",
          email: hook.email.value
            ? hook.email.value
            : userData?.email
            ? userData.email
            : "",
          id: tempId ? tempId : uuidv4(),
          img: userData?.img ? userData.img : randomNumber,
          loginDate: date,
          loginTime: time,
        };
        console.log("inside else->", uploadData);
        const handlePostRequest = async (data: DataInterface) => {
          setShowModal((prev) => !prev);
          await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((data) => data.json())
            .catch((error) => console.log(error));
        };
        handlePostRequest(uploadData);
        setShowModal(false);
        setTimeout(() => {
          handleGetUser();
        }, 1000);
      }
      setTempId("");
    }
  };

  // handling user data edit
  const handleEditUser = async (id: string) => {
    const customId = id ?? undefined;
    await fetch(`${url}/${customId}`)
      .then((data) => data.json())
      .then((tempData) => setUserData(tempData));
    setShowModal(true);
    setTempId(id);
  };

  // sorting according to name, role, status, last login
  const handleSorting = async (sortBy: string) => {
    setFlagForSorting((prev) => !prev);
    if (flagForSorting === true) {
      const response = await fetch(`${url}/?_sort=${sortBy}&_order=asc`);
      const data = await response.json();
      if (data) setClientData(() => data);
    } else {
      const response = await fetch(`${url}/?_sort=random&_order=asc`);
      const data = await response.json();
      if (data) setClientData(() => data);
    }
  };

  // Active and Invited styling
  const StatusBadge = ({ status }: StatusBadgeInterface) => {
    return status === "Active" ? (
      <div className="flex items-center rounded-[10em] text-green-300 border shadow-lg md:w-2/3 p-1">
        <span className="rounded-[50%] bg-green-300 p-1 mr-1.5 w-1 h-1"></span>
        <span>{status}</span>
      </div>
    ) : (
      <div className="flex items-center rounded-[10em] text-gray-300 border shadow-lg md:w-2/3 p-1">
        <span className="rounded-[50%] bg-gray-300 p-1 mr-1.5 w-1 h-1"></span>
        <span>{status}</span>
      </div>
    );
  };

  // Pagination
  const itemsPerPage = 5;
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(clientData.length / itemsPerPage);
  const currentPageData = clientData.slice(offset, offset + itemsPerPage);
  const handlePageClick = (data: { selected: number }) => {
    setCurrentPage(data.selected);
  };

  // display form to edit or add new user
  const ShowModalOnScreen = () => (
    <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="relative my-6 mx-auto w-[50vw]">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
            <h3 className="text-3xl font=semibold">New User Info</h3>
            <button
              className="bg-transparent border-0 text-black float-right"
              onClick={() => setShowModal((prev) => !prev)}
            >
              <span className="flex justify-center items-center text-black opacity-7 h-6 w-6 text-xl bg-gray-400 py-0 rounded-full">
                x
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <form
              onSubmit={(e) => handleModalData(e)}
              className="bg-gray-200 shadow-md rounded px-8 pt-6 pb-8 w-full"
            >
              <label className="block text-black text-sm font-bold mb-1">
                First Name
              </label>
              <input
                name="firstName"
                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
              />
              <label className="block text-black text-sm font-bold mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
              />
              <label className="block text-black text-sm font-bold mb-1">
                Email
              </label>
              <input
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
              />
              <label className="block text-black text-sm font-bold mb-1">
                Role
              </label>
              <input
                name="role"
                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
              />
              <label className="block text-black text-sm font-bold mb-1">
                Status
              </label>
              <input
                name="status"
                className="shadow appearance-none border rounded w-full py-2 px-1 text-black"
              />
              <div className="flex md:flex-row flex-col items-center justify-end mt-14 -mb-2 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={() => setShowModal((prev) => !prev)}
                >
                  Close
                </button>
                <input
                  className="text-white bg-yellow-500 active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 cursor-pointer"
                  type="submit"
                  value="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {showModal && <ShowModalOnScreen />}
      {!showModal && (
        <div>
          <div className="flex flex-col justify-center items-center mt-[5%]">
            <div className="flex flex-col border md:w-[80vw] rounded-lg shadow-lg">
              <div className="p-4 flex justify-between border-b">
                <div className="flex flex-col">
                  <div className="flex mb-3">
                    <span className="text-xl mr-5">Users</span>
                    <span className="rounded border text-green-400 text-sm p-1">
                      {clientData.length} users
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm sm:w-1/2 md:w-auto">
                    Manage your team members and their account permissions here.
                  </p>
                </div>
                <div className="flex p-2">
                  <DownloadButton data={clientData} />
                  <button
                    onClick={() => setShowModal((prev) => !prev)}
                    className="text-white bg-blue-400 border shadow-md flex justify-center items-center rounded-lg px-3"
                  >
                    <AiOutlinePlus fontSize={21} />
                    <span>&nbsp; Add user</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-between p-2 border-b">
                <span
                  onClick={() => handleSorting("firstName")}
                  className="flex text-gray-400 text-sm items-center justify-center ml-8 cursor-pointer"
                >
                  Name &nbsp; <AiOutlineArrowDown fontSize={15} />
                </span>
                <div
                  onClick={() => handleSorting("status")}
                  className="flex p-2 w-1/2 justify-between"
                >
                  <span className="flex text-gray-400 text-sm items-center justify-center mx-2 cursor-pointer">
                    Status &nbsp; <AiOutlineArrowDown fontSize={15} />
                  </span>
                  <span
                    onClick={() => handleSorting("role")}
                    className="flex text-gray-400 text-sm items-center justify-center mx-2 cursor-pointer"
                  >
                    Role &nbsp; <AiOutlineArrowDown fontSize={15} />
                  </span>
                  <span
                    onClick={() => handleSorting("login")}
                    className="flex text-gray-400 text-sm items-center justify-center mx-2 cursor-pointer"
                  >
                    Last Login &nbsp; <AiOutlineArrowDown fontSize={15} />
                  </span>
                  <span className="flex text-gray-400 text-sm items-center justify-center mx-2 md:w-1/6 lg:w-1/4"></span>
                </div>
              </div>
              {currentPageData.map((user, idx) => {
                let tempStyle = {};
                if (idx & 1) {
                  tempStyle = {
                    background: "#ececec",
                  };
                }
                return (
                  <div
                    key={idx}
                    style={tempStyle}
                    className="flex justify-between border-b border-black text-sm p-2"
                  >
                    <div className="flex justify-center items-center">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={`/images/avatar${user?.img}.png`}
                        alt=""
                      />
                      <div className="flex flex-col p-2">
                        <span className="">
                          {user.firstName.charAt(0).toUpperCase() +
                            user.firstName.slice(1)}
                          &nbsp;
                          {user.lastName.charAt(0).toUpperCase() +
                            user.lastName.slice(1)}
                        </span>
                        <span className="text-gray-400">{user.email}</span>
                      </div>
                    </div>
                    <div className="flex w-1/2 -mr-2 items-center">
                      <div className="text-sm md:w-1/5 sm:w-1/4 mr-5">
                        <StatusBadge status={user.status} />
                      </div>
                      <div className="text-gray-400 mr-2 text-sm w-1/5">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                      <div className="flex flex-col mx-2 text-sm">
                        <span>{user.loginDate}</span>
                        <span className="text-gray-400">{user.loginTime}</span>
                      </div>
                      <div className="flex mx-2 text-sm justify-evenly md:w-1/6 lg:w-1/3 ml-10">
                        <RiDeleteBin6Line
                          onClick={() => handleDeleteRequest(user.id)}
                          fontSize={21}
                          className="cursor-pointer"
                        />
                        <VscEdit
                          onClick={() => handleEditUser(user.id)}
                          fontSize={21}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <ReactPaginate
                pageCount={pageCount}
                breakLabel="..."
                pageRangeDisplayed={5}
                marginPagesDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageLinkClassName="flex"
                renderOnZeroPageCount={null}
                disabledLinkClassName="flex"
                activeLinkClassName="flex border w-6 h-6 rounded-full items-center justify-center text-black shadow-md"
                className="flex justify-around p-4 text-gray-400"
                previousClassName="flex border shadow-lg text-gray-400 rounded w-22 justify-center p-1 items-center"
                nextClassName="flex border shadow-lg text-gray-400 rounded w-20 justify-center p-1 items-center"
                previousLabel={
                  <div className="flex items-center justify-around text-sm mx-2">
                    <AiOutlineArrowLeft fontSize={15} className="" />
                    &nbsp;Previous
                  </div>
                }
                nextLabel={
                  <div className="flex items-center">
                    <span>Next</span>&nbsp;
                    <AiOutlineArrowRight fontSize={18} />
                  </div>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayData;
