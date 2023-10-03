const User = require('../../models/users.model');
const RoleCount = require('../../models/AdminModels/RoleCount.model');

// Function to fetch and return role counts, including total users count
const getRoleCounts = async (req, res) => {
  try {
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate total user count
    const totalUserCount = roleCounts.reduce((total, roleCount) => total + roleCount.count, 0);

    // Create/update RoleCount documents based on role counts
    await Promise.all(
      roleCounts.map(async (roleCount) => {
        const { _id: role, count } = roleCount;
        await RoleCount.findOneAndUpdate({ role }, { count }, { upsert: true });
      })
    );

    const allRoleCounts = await RoleCount.find();

    // Include the total user count in the response
    res.status(200).json([{ role: 'Total Users', count: totalUserCount }, ...allRoleCounts]);
  } catch (error) {
    console.error('Error fetching role counts:', error);
    res.status(500).json({ error: 'An error occurred while fetching role counts' });
  }
};

module.exports = { getRoleCounts };
