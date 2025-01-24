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

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    // Kiểm tra xem Role có tồn tại hay không
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Cập nhật thông tin Role với dữ liệu từ req.body
    const result = await Role.updateOne({ _id: id }, req.body);

    // Kiểm tra kết quả cập nhật
    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: "No changes were made" });
    }

    return res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating Role:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



module.exports.permissionsPatch = async (req, res) => {
  try {
    // console.log("Body received from client:", req.body); // Debug dữ liệu từ client
    const roles = req.body;

    // Kiểm tra roles
    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({
        message: "Invalid input: 'roles' must be an array",
      });
    }

    // Duyệt qua từng role trong mảng
    for (const role of roles) {
      const permissionsObject = role.permissions;

      // Lấy các key có giá trị true từ object permissions
      const updatedPermissions = Object.keys(permissionsObject).filter(
        (key) => permissionsObject[key] === true
      );

      // Cập nhật Role trong database
      await Role.updateOne(
        { _id: role._id }, // Tìm theo _id
        { permissions: updatedPermissions } // Lưu permissions dưới dạng mảng string
      );
    }

    res.status(200).json({ message: "Cập nhật phân quyền thành công!" });
  } catch (error) {
    console.error("Error updating role permissions:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi khi cập nhật phân quyền!" });
  }
};



