import LandingSliderModal from "../../models/landing-slider/landing-slider.model";

class LandingSliderController {
  static async create(req, res) {
    try {
      const { title, description, property_type, images } = req.body;

      if (!title || !property_type || !images) {
        return res.status(400).json({
          success: false,
          message: "title, property_type and images are required",
        });
      }

      const slider = await LandingSliderModal.create({
        title,
        description,
        property_type,
        images,
      });

      return res.status(201).json({
        success: true,
        message: "Landing slider content created successfully",
        data: slider,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create landing slider content",
      });
    }
  }

  static async getAll(req, res) {
    try {
      const sliders = await LandingSliderModal.getAll();

      return res.status(200).json({
        success: true,
        data: sliders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch landing slider content",
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Slider ID is required",
        });
      }

      const updatedSlider = await LandingSliderModal.update(id, payload);

      return res.status(200).json({
        success: true,
        message: "Landing slider content updated successfully",
        data: updatedSlider,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update landing slider content",
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Slider ID is required",
        });
      }

      const deletedSlider = await LandingSliderModal.delete(id);

      return res.status(200).json({
        success: true,
        message: "Landing slider content deleted successfully",
        data: deletedSlider,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete landing slider content",
      });
    }
  }
}

export default LandingSliderController;
