import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
import type { Document } from "mongoose";

const Settings = ["api_key"] as const;
type Settings = (typeof Settings)[number];

export interface ISettings extends Document {
  _id: string;
  key: Settings;
  value: string;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

let SettingsModel: mongoose.Model<ISettings>;
try {
  SettingsModel = models.settings || model<ISettings>("Settings");
} catch (e) {
  SettingsModel = model("Settings", SettingsSchema);
}

export default SettingsModel;
