import { useEffect, useState } from "react";
import { apiDELETE, apiGET } from "../../helpers/apiHelper";
import { Alert, Button, Snackbar } from "@mui/material";
import DataTable from "react-data-table-component";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from '@mui/icons-material/Add';


const LevelsList = () => {

    const [chapterList, setChapterList] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate()
    const [limit, setLimit] = useState(10);
    const [totalResults, setTotalResults] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertChange, setAlertChange] = useState(false)
    const [selectedRows, setSelectedRows] = useState(false);

    const handleChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
    };

    const onHandleAddLevel = () => {
        navigate('/levels/addlevel')
    }

    const getChapters = async () => {
        try {
            let response = await apiGET(`/v1/level/get-all-level`)

            if (response?.data?.code === 200) {
                let data = response?.data?.data;
                setChapterList(data?.data)
                setTotalResults(data?.totalResults)
                setTotalPages(data?.totalPages)
            } else {
                setAlertOpen(true)
                setErrorMessage(response.data?.data || response?.data?.message)
            }

        } catch (error) {
            console.error("Error in get chapters:-", error)
        }
    }

    const columns = [
        {
            name: 'Title',
            selector: row => row.levelTitle,
            sortable: true,
        },
        {
            name: 'Created on',
            selector: (row) => (moment(row.createdAt).format("LLL")),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <EditButton row={row} />
                    <DeleteButton row={row} />
                </div>
            ),
        }
    ]

    const EditButton = ({ row }) => {
        const handleEditClick = () => {
            navigate(`/levels/addlevel/${row?._id}`);
        };
        return <Button onClick={handleEditClick} ><EditIcon /> </Button>;
    };

    const DeleteButton = ({ row }) => {
        const handleDeleteLevel = async () => {
            try {
                const result = await apiDELETE(`/v1/level/delete-level-by-id/${row?._id}`)
                if (result?.data?.status) {
                    setAlertOpen(true)
                    setAlertChange(true)
                    setErrorMessage(result?.data?.data)
                    getChapters()
                } else {
                    setAlertOpen(true)
                    setErrorMessage(response.data?.data || response?.data?.message)
                }
            } catch (error) {
                console.log("Error will fetching all Level", error);

            }
        }
        return <Button onClick={handleDeleteLevel} variant="outlined" color="error"> <DeleteForeverIcon /></Button>
    }

    useEffect(() => {
        if (alertOpen) {
            setTimeout(() => {
                setAlertOpen(false)
                setErrorMessage("")
            }, 7000)
        }
    }, [alertOpen])

    useEffect(() => {
        getChapters()
    }, [])

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
                fontWeight: 600, // Font weight for data cells
                color: '#495057', // Text color for data cells
            },
        },
    };

    return (
        <div className="w-full">
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                {errorMessage ?
                    <Alert onClose={() => setAlertOpen(false)} severity={alertChange ? "success" : "error"}>
                        {errorMessage}
                    </Alert>
                    :
                    ""
                }

            </Snackbar>
            <div className="flex justify-between items-center px-5 pt-6">
                <div className="text-lg font-semibold gap-2">
                    {totalResults} Level
                </div>

                <div>
                    <button onClick={onHandleAddLevel} className="text-sm text-white py-2 px-4  bg-[#34C38F] rounded-full font-semibold" > <AddIcon />  Add Level</button>
                    {/* <Button variant="contained" disableElevation onClick={onHandleAddLevel}>
                        Add Level
                    </Button> */}
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
    )
}

export default LevelsList;