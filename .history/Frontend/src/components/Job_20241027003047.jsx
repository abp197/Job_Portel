/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgo = useMemo(() => {
        const createdAt = new Date(job?.createdAt);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }, [job?.createdAt]);

    return (
        <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{daysAgo === 0 ? "Today" : `${daysAgo} days ago`}</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className="flex items-center gap-2 my-2">
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo || 'default-logo.png'} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className="font-medium text-lg">{job?.company?.name || 'Company Name'}</h1>
                    <p className="text-sm text-gray-500">India</p>
                </div>
            </div>

            <div>
                <h1 className="font-bold text-lg my-2">{job?.title || 'Job Title'}</h1>
                <p className="text-sm text-gray-600">{job?.description || 'Job description goes here...'}</p>
            </div>

            <div className="flex items-center gap-2 mt-4">
                <Badge className="text-blue-700 font-bold" variant="ghost">{job?.position || '1'} Positions</Badge>
                <Badge className="text-[#F83002] font-bold" variant="ghost">{job?.jobType || 'Full-time'}</Badge>
                <Badge className="text-[#7209b7] font-bold" variant="ghost">{job?.salary || '0'} LPA</Badge>
            </div>

            <div className="flex items-center gap-4 mt-4">
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    );
};

export default Job;