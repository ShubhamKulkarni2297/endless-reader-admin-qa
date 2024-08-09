import { Alert, Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { apiGET, apiPOST, apiPUT } from '../../helpers/apiHelper';
import { useNavigate, useParams } from 'react-router-dom';

const AddLevel = () => {
    const [age, setAge] = useState("age")
    const [word, setWord] = useState('');
    const { id } = useParams()
    const navigate = useNavigate()
    const [words, setWords] = useState([]);
    const [chapters, setChapters] = useState([])
    const [selectedChapter, setSelectedChapter] = useState('');
    const [levelTitle, setLevelTitle] = useState('')
    const [sentence, setSentence] = useState('')
    const [alertOpen, setAlertOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [successAlert, setSuccessAlert] = useState(false)
    const [successMsg, setSuccessMsg] = useState()

    const getAllChapterList = async () => {
        try {
            let response = await apiGET(`/v1/chapter/get-all-chapters`)
            if (response?.data?.data?.data?.length > 0) {
                const chapterList = response?.data?.data?.data?.map(chapter => ({
                    _id: chapter._id,
                    chapterTitle: chapter.chapterTitle,
                }));
                setChapters(chapterList);
            } else {
                setAlertOpen(true)
                setErrorMessage(response.data?.data || response?.data?.message)
                setChapters([])
            }
        } catch (error) {
            console.log("Error will fetching all Level", error);
        }
    }

    const onHandleUpdateLevel = async () => {
        try {
            let payload = {
                // levelTitle: levelTitle,
                words: words,
                sentence: sentence,
                // chapterId: selectedChapter
            }
            let response = await apiPUT(`/v1/level/update-level-by-id/${id}`, payload)
            if (response?.data?.status) {
                setSuccessAlert(true)
                setSuccessMsg("Level updated successfully.")
                // navigate('/levels')
            } else {
                setAlertOpen(true)
                setErrorMessage(response.data?.data || response?.data?.message)
            }
        } catch (error) {
            console.log("error while updatinf level", error);
        }

    }

    const getLevelById = async () => {
        try {
            let response = await apiGET(`/v1/level/get-level-by-id/${id}`)
            if (response?.data?.status) {
                setLevelTitle(response?.data?.data?.levelTitle)
                setSentence(response?.data?.data?.sentence)
                setSelectedChapter(response?.data?.data?.chapterId)
                setWords(response?.data?.data?.words)
            } else {
                setAlertOpen(true)
                setErrorMessage(response.data?.data || response?.data?.message)
            }
        } catch (error) {
            console.log("error will getting specific level by id", error);
        }
    }

    //ADD Level integration remaining
    const addLevel = async () => {
        try {
            let payload = {
                levelTitle: levelTitle,
                words: words,
                sentence: sentence,
                chapterId: selectedChapter
            }
            let response = await apiPOST(`/v1/level/add-level`, payload)
            if (response?.data?.status) {
                setLevelTitle('')
                setWords([])
                setSentence('')
                setSelectedChapter('')
                setSuccessAlert(true)
                setSuccessMsg("Level added successfully.")
            } else {
                setAlertOpen(true)
                setErrorMessage(response.data?.data || response?.data?.message)
            }
        } catch (error) {
            console.log("error while adding level", error);
        }


    }

    const handleChange = (event) => {
        setSelectedChapter(event?.target?.value);
    };

    const handleSave = () => {
        setWords([...words, word]);
        setWord('');
    };

    const handleDelete = (wordToDelete) => {
        setWords(words.filter(w => w !== wordToDelete));
    };

    useEffect(() => {
        getAllChapterList()
        if (id) {
            getLevelById()
        }
    }, [])
    return (
        <div className='w-full bg-[#F8F8F8] '>
            <Snackbar
                open={alertOpen}
                autoHideDuration={6000}
                onClose={() => setAlertOpen(false)}
            >
                {errorMessage ?
                    <Alert onClose={() => setAlertOpen(false)} severity="error">
                        {errorMessage}
                    </Alert>
                    :
                    ""
                }

            </Snackbar>

            <Snackbar
                open={successAlert}
                autoHideDuration={6000}
                onClose={() => successMsg(false)}
            >
                {successMsg ?
                    <Alert onClose={() => successMsg(false)} severity="success">
                        {successMsg}
                    </Alert>
                    :
                    ""
                }
            </Snackbar>
            <div className='w-full text-xl px-4 pt-4 uppercase font-semibold'>{`${id ? "Update level" : "Add Level"}`}</div>
            <div className=' flex flex-col  mt-4  p-4 bg-white m-4 gap-4 rounded-[8px]'>

                <div className='w-full text-xl text-[16px] font-semibold    '>
                    <div> {`${id ? "Update level" : "Add Level"}`}</div>
                    <div className='w-full text-[13px] text-[#767A8E] '>{`${id ? "Fill the form to update level" : "Fill the form to add Level"}`}</div>
                </div>
                <div className='flex items-center'>
                    <div className='text-[13px] text-[#495057] font-medium w-[120px]'>Level Title</div>
                    <TextField id="levelTitle"
                        // label="LevelTitle"
                        variant="outlined"
                        value={levelTitle}
                        disabled={id ? true : false}
                        onChange={(e) => (setLevelTitle(e?.target?.value))}
                        className='w-full'
                    />
                </div>
                <div className='flex items-center'>
                    <div className='text-[13px] text-[#495057] font-medium w-[120px]'>Word</div>
                    <TextField
                        id="Word"
                        // label="Word"
                        variant="outlined"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                        className='w-full'
                    />
                </div>
                <div className='flex items-center'>
                    <div className='text-[13px] text-[#495057] font-medium  w-[110px]'></div>

                    {words?.length > 0 && <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        marginTop: 1,
                        border: '1px solid #B8B8B8',
                        borderRadius: '8px',
                        padding: 1
                    }}>
                        {words.map((word, index) => (
                            <Chip
                                key={index}
                                label={word}
                                onDelete={() => handleDelete(word)}
                                variant="outlined"
                            />
                        ))}
                    </Box>}
                </div>
                <div className='space-x-2'>
                    <div className='flex items-center'>
                        <div className='text-[13px] text-[#495057] font-medium w-[110px]'></div>
                        <Button variant="outlined" disableElevation onClick={handleSave}>
                            Add more words
                        </Button>
                    </div>
                </div>
                <div className='flex items-center'>
                    <div className='text-[13px] text-[#495057] font-medium w-[120px]'>Sentence</div>
                    <TextField id="Sentence"
                        // label="Sentence"
                        variant="outlined"
                        value={sentence}
                        onChange={(e) => { setSentence(e?.target?.value) }}
                        className='w-full' />
                </div>
                <div className='flex items-center w-full'  >
                    <div className='text-[13px] text-[#495057] font-medium w-[120px]'>Chapter</div>
                    <FormControl className='w-full'>
                        <InputLabel id="demo-simple-select-label" className='w-full'>  </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedChapter}
                            // label="Chapter"
                            onChange={handleChange}
                            disabled={id ? true : false}
                            className='w-full'
                        >
                            {chapters.map(chapter => (
                                <MenuItem key={chapter._id} value={chapter._id} className='w-full'  >
                                    {chapter.chapterTitle}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className='flex'>
                    <div className='text-[13px] text-[#495057] font-medium  w-[120px]'></div>
                    {id ? (
                        <button onClick={onHandleUpdateLevel} className="text-sm text-white py-2 px-4  bg-[#34C38F] rounded-full font-semibold"   >
                            Update Level
                        </button>
                    ) : (
                        <button onClick={addLevel} className="text-sm text-white py-2 px-4  bg-[#34C38F] rounded-full font-semibold" >
                            Add Level
                        </button>
                    )}

                </div>
            </div>

        </div>
    )
}

export default AddLevel
