import { Alert, Button, Snackbar, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { apiPOST } from "../../helpers/apiHelper";
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import AddIcon from '@mui/icons-material/Add';


const AddChapters = () => {
    const navigate = useNavigate();

    const [addChapters, setAddChapters] = useState({
        chapterTitle: "",
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("success"); 
    const [alertMessage, setAlertMessage] = useState(""); 

    const handleAddChapters = async () => {
        const payload = {
            chapterTitle: addChapters?.chapterTitle,
        };

        try {
            const response = await apiPOST("/v1/chapter/add-chapter", payload);

            if (response.status === 201) {
                setAlertType("success");
                setAlertMessage("Chapters added successfully");
                setAlertOpen(true);
                navigate("/chapters");
                
            } else {
                setAlertType("error");
                setAlertMessage(response.data?.data || response?.data?.message || "Failed to add chapter");
                setAlertOpen(true);
            }
        } catch (error) {
            console.log(error);
            setAlertType("error");
            setAlertMessage("An error occurred while adding the chapter.");
            setAlertOpen(true);
        }
      
    };

    useEffect(() => {
        if (alertOpen) {
            const timer = setTimeout(() => {
                setAlertOpen(false);
                setAlertMessage("");
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [alertOpen]);

    

    return (
        <div>

            <div className="flex gap-3 mt-4 w-full">
                <Snackbar
                    open={alertOpen}
                    autoHideDuration={6000}
                    onClose={() => setAlertOpen(false)}
                >
                    <Alert onClose={() => setAlertOpen(false)} severity={alertType} >
                        {alertMessage}
                    </Alert>
                </Snackbar>


                <Card sx={{ minWidth: 1100, minHeight: 600, p: 3 }}>
      <CardContent className="popins-bold">
       Add New Chapters
       
      </CardContent>
      <CardActions>
      <div>
                    <TextField
                        id="outlined-basic"
                        // label="Chapter Title"
                        placeholder="add chapter"
                        value={addChapters.chapterTitle}
                        onChange={(e) =>
                            setAddChapters({
                                ...addChapters,
                                chapterTitle: e.target.value,
                            })
                        }
                    />
                     {/* <div className='text-[13px] text-[#495057] font-medium w-[120px]'>Sentence</div> */}
                    {/* <TextField id="Sentence"
                        // label="Sentence"
                        // variant="outlined"
                        value={sentence}
                        onChange={(e) => { setSentence(e?.target?.value) }}
                        className='w-full' />
                </div> */}
                </div>

                <button
                    onClick={handleAddChapters}
                    variant="contained"
                    className="text-sm text-white py-2 px-4  bg-[#34C38F] rounded-full font-semibold" 
                > <AddIcon />
                    Add
                </button>
      </CardActions>
    </Card>
               
            </div>
        </div>
    );
};

export default AddChapters;
