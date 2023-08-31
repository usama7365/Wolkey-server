exports.DashboardController = (req, res) => {
  try {
    const userId = req.user.userId; // Use req.user.userId
    res.status(200).json({ message: `Welcome to the dashboard, user ${userId}!` });
  } catch (error) {
    console.error('Error in DashboardController:', error);
    res.status(500).json({ error: 'An error occurred while fetching dashboard data' });
  }
};
