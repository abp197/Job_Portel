import { setAllJobs } from '../components/redux/jobSlice'
import { JOB_API_END_POINT } from '../utils/constant.js'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${yourAuthToken}`,  // replace `yourAuthToken` with the actual token
                    },
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        };
        
}

export default useGetAllJobs