import React, { useEffect, useState } from 'react';
import { apiGET } from '../../helpers/apiHelper';
import DataTable from 'react-data-table-component';
import moment from 'moment';

const UserDeviceList = () => {
    const [Userdevice, setUserdevice] = useState([]);
    const [mappedData, setMappedData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [totalResults, setTotalResults] = useState(0);

    const getUserDevice = async () => {
        try {
            let response = await apiGET(`/v1/users-device/get-all-userdevices`);

            if (response?.data?.code === 200) {
                let data = response?.data?.data;
                setUserdevice(data?.data);
                setTotalResults(data?.totalResults);
                mapProgressData(data?.data);
            }
        } catch (error) {
            console.error("Error in getting user devices:", error);
        }
    };

    const mapProgressData = (data) => {
        const mapped = data.map(device => {
            return device?.progress?.map(chapter => {
                console.log("Chapter Object:", chapter); 
    
                return {
                    deviceId: device.deviceId,
                    active : device?.active,
                    chapterTitle: chapter?.chapterTitle,
                    isCompleted: chapter[0]?.isCompleted, 
                    isUnlocked: chapter[0]?.isUnlocked    
                };
            });
        }).flat();
    
        console.log("Mapped Data:", mapped); // Check the final mapped data
        setMappedData(mapped);
    };
    

    useEffect(() => {
        getUserDevice();
    }, []);

    const columns = [
        {
            name: "Device ID",
            selector: (row) => row.deviceId,
            sortable: true,
        },
        {
            name: "Chapter ID",
            selector: (row) => row.chapterTitle,
            wrap: true,
        },
        // {
        //     name: "Active",
        //     selector: (row) => row.active,
        //     wrap: true,
        // },
        // {
        //     name: "Is Completed",
        //     selector: (row) => row.isCompleted,
        //     wrap: true,
        // },
        // {
        //     name: "Is Unlocked",
        //     selector: (row) => row.isUnlocked,
        //     wrap: true,
        // },
    ];

    return <>
        <div className="w-full">
            <div className="flex justify-between m-5">
                <div>{totalResults} Devices</div>
            </div>
            <div className="w-full px-5 pt-6">
                <DataTable
                    columns={columns}
                    data={mappedData}
                    pagination
                    paginationRowsPerPageOptions={[1, 5, 10, totalResults]}
                    paginationPerPage={limit}
                />
            </div>
        </div>
        </>
    
};

export default UserDeviceList;
