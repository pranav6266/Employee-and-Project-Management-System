const mongoose = require('mongoose');

const modulesSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    progressNotes: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, {
    timestamps: true
});

const Module = mongoose.model('Module', modulesSchema);

module.exports = Module;