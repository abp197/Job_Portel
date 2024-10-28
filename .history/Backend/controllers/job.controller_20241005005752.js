import mongoose from "mongoose"; // Import mongoose
import { Job } from "../models/job.model.js";

// Admin posts a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// For students: Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

// For students: Get job by ID
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is valid ObjectId
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Job ID' });
        }

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all jobs posted by the admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            options: { sort: { createdAt: -1 } }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};