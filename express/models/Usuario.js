const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamMembers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['manager', 'developer', 'designer', 'tester'],
            default: 'developer'
        }
    }],
    status: {
        type: String,
        enum: ['planning', 'active', 'on-hold', 'completed',
            'cancelled'],
        default: 'planning'
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    client: String
}, {
    timestamps: true
});

// Task Schema 
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review', 'completed'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    dueDate: Date,
    estimatedHours: Number,
    actualHours: Number,
    tags: [String],
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
const Project = mongoose.model('Project', projectSchema);


module.exports = {
    Task,
    Project
};