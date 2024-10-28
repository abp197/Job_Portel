import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/constant.js';
import { setSingleJob } from '../components/redux/jobSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner'; // Ensure this is correctly set up for notification

const JobDescription = () => {
    const { jobId } = useParams(); // Get job ID from URL
    const dispatch = useDispatch();
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    
    // Check if the user has already applied for the job
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);

    // Apply for the job
    const applyJobHandler = async () => {
    if (!jobId) {
        toast.error("Job ID is missing.");
        return;
    }
    
    try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
            withCredentials: true
        });

        if (res.data.success) {
            setIsApplied(true);
            const updatedSingleJob = { 
                ...singleJob, 
                applications: [...singleJob.applications, { applicant: user?._id }] 
            };
            dispatch(setSingleJob(updatedSingleJob));
            toast.success('Job application successful!');
        } else {
            toast.error(res.data.message || 'Failed to apply for the job.');
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Error applying for the job.');
    }
};

    // Fetch the single job details when the component loads
    useEffect(() => {
        if (jobId) {
            const fetchSingleJob = async () => {
                try {
                    const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                    if (res.data.success) {
                        dispatch(setSingleJob(res.data.job));
                        // Check if user has already applied for this job
                        setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                    } else {
                        toast.error('Failed to load job details.');
                    }
                } catch (error) {
                    console.error('Error fetching job details:', error);
                    toast.error('An error occurred while loading job details.');
                }
            };
            fetchSingleJob();
        }
    }, [jobId, dispatch, user?._id]);

    return (
        <div className="max-w-7xl mx-auto my-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-xl">{singleJob?.title}</h1>
                    <div className="flex items-center gap-2 mt-4">
                        <span className="badge text-blue-700 font-bold">{singleJob?.position} Positions</span>
                        <span className="badge text-[#F83002] font-bold">{singleJob?.jobType}</span>
                        <span className="badge text-[#7209b7] font-bold">{singleJob?.salary} LPA</span>
                    </div>
                </div>
                <button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'} text-white p-2`}
                >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </button>
            </div>
            <h1 className="border-b-2 border-b-gray-300 font-medium py-4">Job Description</h1>
            <div className="my-4">
                <h1 className="font-bold my-1">Role: <span className="pl-4 font-normal text-gray-800">{singleJob?.title}</span></h1>
                <h1 className="font-bold my-1">Location: <span className="pl-4 font-normal text-gray-800">{singleJob?.location}</span></h1>
                <h1 className="font-bold my-1">Description: <span className="pl-4 font-normal text-gray-800">{singleJob?.description}</span></h1>
                <h1 className="font-bold my-1">Experience: <span className="pl-4 font-normal text-gray-800">{singleJob?.experience} yrs</span></h1>
                <h1 className="font-bold my-1">Salary: <span className="pl-4 font-normal text-gray-800">{singleJob?.salary} LPA</span></h1>
                <h1 className="font-bold my-1">Total Applicants: <span className="pl-4 font-normal text-gray-800">{singleJob?.applications?.length}</span></h1>
                <h1 className="font-bold my-1">Posted Date: <span className="pl-4 font-normal text-gray-800">{new Date(singleJob?.createdAt).toLocaleDateString()}</span></h1>
            </div>
        </div>
    );
};

export default JobDescription;
