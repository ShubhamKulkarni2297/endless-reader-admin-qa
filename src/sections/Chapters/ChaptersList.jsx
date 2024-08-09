import { useEffect, useState } from "react";
import { apiDELETE, apiGET } from "../../helpers/apiHelper";
import { Alert, Box, Button, Modal, Snackbar } from "@mui/material";
import DataTable from "react-data-table-component";
import moment from "moment/moment";
import { useNavigate, useParams } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from '@mui/icons-material/Add';


const ChaptersList = () => {
    const navigate = useNavigate();
    const [chapterList, setChapterList] = useState([]);
    const [limit, setLimit] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState(null); 
    const [alertType, setAlertType] = useState("success"); 
    const [alertMessage, setAlertMessage] = useState(""); 

    const [selectedRows, setSelectedRows] = useState(false);
    const [open, setOpen] = useState(false);


    const handleClose = () => setOpen(false);

    const handleChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
    };

    const handleOpen = (id) => {
        setSelectedChapterId(id); 
        setOpen(true);
    };

    const handlebuttonClick = () => {
        navigate("/chapters/add");
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };

    const getChapters = async () => {
        try {
            let response = await apiGET(`/v1/chapter/get-all-chapters`);

            if (response?.data?.code === 200) {
                let data = response?.data?.data;
                console.log("data:", data);
                setChapterList(data?.data);
                setTotalResults(data?.totalResults);
                setTotalPages(data?.totalPages);
            } else {
                setAlertOpen(true);
                setAlertMessage(response.data?.data || response?.data?.message);
            }
        } catch (error) {
            console.error("Error in get chapters:-", error);
        }
    };

    const handleDeleteChapter = async (id) => {
        try {
            let response = await apiDELETE(
                `/v1/chapter/delete-chapter-by-id/${selectedChapterId}`
            );

            if (response?.data?.code === 200) {
                setOpen(false)
                setAlertType("success");
                setAlertMessage("Chapters deleted successfully");
                setAlertOpen(true);
                getChapters();
            } else {
                setAlertType("error");
                setAlertMessage(response.data?.data || response?.data?.message || "Failed to add chapter");
                setAlertOpen(true);
            }
        } catch (error) {
            console.error("Error in get chapters:-", error);
        }
    };

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#EFF2F7', // Header background color
                color: '#000', // Header text color (optional)
            },
        },
        headCells: {
            style: {
                color: '#000', // Header text color (optional)
                fontSize: '14px', // Font size for header (optional)
                fontWeight: 'bold', // Font weight for header (optional)
            },
        },
        headRow: {
            style: {
                backgroundColor: '#EFF2F7', // Header background color
                color: '#000', // Header text color (optional)
            },
        },
        rows: {
            style: {
                // backgroundColor: '#EFF2F7', // Set background color for rows
            },
        },
        cells: {
            style: {
                paddingLeft: '16px', // Adjust cell padding (optional)
                paddingRight: '16px', // Adjust cell padding (optional)
                fontSize: '13px', // Font size for data cells
                // fontWeight: 600, // Font weight for data cells
                color: '#495057', // Text color for data cells
            },
        },
    };

    const columns = [
        {
            name: "Title",
            selector: (row) => row.chapterTitle,
            sortable: true,
        },
        {
            name: "Created on",
            selector: (row) => moment(row.createdAt).format("LLL"),
            sortable: true,
        },
        {
            name: "Action",
            // selector: (row) => <Button onClick={()=>handleDeleteChapter(row._id)} variant="outlined" color="error">
            selector: (row) => (
                <Button onClick={()=>handleOpen(row._id)} variant="outlined" color="error">
                    <DeleteForeverIcon />
                </Button>
            ),
            sortable: true,
        },
    ];

    useEffect(() => {
        if (alertOpen) {
            setTimeout(() => {
                setAlertOpen(false);
                setAlertMessage("");
            }, 7000);
        }
    }, [alertOpen]);

    useEffect(() => {
        getChapters();
    }, []);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="w-[50%]">
                    <div className="text-3xl text-center">delete Chapter</div>
                    <div className="mt-8 text-lg text-center">
                        Do you want to delete the selected chapter?
                    </div>
                    <div className="mt-12 flex justify-center gap-x-6">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleDeleteChapter}
                        >
                            Delete
                        </Button>

                        <Button 
                        variant="contained" 
                        color="error"
                        onClick={handleClose}
                        >
                            Cancle
                        </Button>
                    </div>
                </Box>
            </Modal>
            <div className="w-full">
            <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={() => setAlertOpen(false)}
                >
                    <Alert onClose={() => setAlertOpen(false)} severity={alertType} >
                        {alertMessage}
                    </Alert>
                </Snackbar>
                <div className="flex justify-between m-5 text-lg font-semibold gap-2">
                    <div>{totalResults} Chapters</div>
                    <div>
                        <button
                            onClick={handlebuttonClick}
                            variant="contained"
                            className="text-sm text-white py-2 px-4  bg-[#34C38F] rounded-full font-semibold" 
                            
                            // sx={{
                            //     borderRadius: '50px', 
                            //     padding: '10px 20px', 
                            // }}
                        > <AddIcon />
                            Add Chapters
                        </button>
                    </div>
                </div>
                <div className="w-full px-5 pt-6">
                    <DataTable
                        columns={columns}
                        data={chapterList}
                        selectableRows
                        onSelectedRowsChange={handleChange}
                        pagination
                        paginationRowsPerPageOptions={[1, 5, 10, totalResults]}
                        paginationPerPage={limit}
                        customStyles={customStyles}

                    />
                </div>
            </div>
        </>
    );
};

export default ChaptersList;
