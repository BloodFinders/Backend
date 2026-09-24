const BloodRequest = require('../models/BloodRequest');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    // Populate requester name for detail screens
    const requestsList = await BloodRequest.find()
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 });

    const formattedRequests = requestsList.map((req) => ({
      id: req._id,
      patientName: req.patientName,
      bloodGroup: req.bloodGroup,
      units: req.units,
      hospital: req.hospital,
      city: req.city,
      contact: req.contact,
      description: req.description,
      status: req.status,
      date: req.date,
      requesterName: req.requester ? req.requester.name : 'Unknown User',
    }));

    res.status(200).json({
      success: true,
      count: formattedRequests.length,
      requests: formattedRequests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blood request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res, next) => {
  try {
    const { patientName, bloodGroup, units, hospital, city, contact, description } = req.body;

    const request = await BloodRequest.create({
      requester: req.user.id,
      patientName,
      bloodGroup,
      units: Number(units),
      hospital,
      city,
      contact,
      description,
    });

    // Write audit log
    await ActivityLog.create({
      actor: req.user.name,
      action: `Created blood request for ${patientName} (${bloodGroup})`,
    });

    // Create system notifications for admin/superadmin review
    // We can simulate an admin notification here, or just create it when approved.

    res.status(201).json({
      success: true,
      request: {
        id: request._id,
        patientName: request.patientName,
        bloodGroup: request.bloodGroup,
        units: request.units,
        hospital: request.hospital,
        city: request.city,
        contact: request.contact,
        description: request.description,
        status: request.status,
        date: request.date,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request status
// @route   PUT /api/requests/:id/status
// @access  Private (Admin / SuperAdmin only)
exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Approved', 'Fulfilled', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Blood request not found' });
    }

    request.status = status;
    await request.save();

    // Create notification for requester
    await Notification.create({
      userId: request.requester,
      type: 'Request Update',
      message: `Your blood request for ${request.patientName} has been ${status.toLowerCase()}.`,
      time: 'Just now',
    });

    // Audit logs
    await ActivityLog.create({
      actor: req.user.name,
      action: `${status} blood request for ${request.patientName}`,
    });

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      request,
    });
  } catch (error) {
    next(error);
  }
};
