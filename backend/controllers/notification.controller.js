import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const user = req.user._id;
        const notifications = await Notification.find({to:user }).sort({ createdAt: -1 })
        .populate({path: 'from', select: 'username profileImg'});
        
        await Notification.updateMany({to:user}, {read:true});
        res.status(200).json(notifications);

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("error in getNotification controller", error.message);        
    }
}

export const deleteNotifications = async (req, res) => {
    try {

        const user = req.user._id;
        await Notification.deleteMany({to:user});
        res.status(200).json({ message: "Notifications deleted successfully" });

    } catch (error) {
        
        res.status(500).json({ message: error.message });
        console.log("error in deleteNotification controller", error.message);
    }
    
}