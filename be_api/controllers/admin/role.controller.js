const Role = require("../../models/role.model")

module.exports.getAllRole = async (req, res) => {
  try {
    const data = await Role.find(
      {
        deleted: false
      })
      .lean()
      .select("-deleted -createdAt -updatedAt");
    return res.json(data);
  } catch (error) {
    return res.json({ message: "Error get Role" });
  }
}

module.exports.createPost = async (req, res) => {
  try {
    const records = new Role(req.body)
    await records.save()
    return res.json("create success");
  } catch (error) {
    console.log(error);
    return res.json("create error");

  }
}

module.exports.deleteRole = async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra nếu role tồn tại
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Thực hiện xóa mềm
    await Role.updateOne({ _id: id }, { deleted: true });

    return res.json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

