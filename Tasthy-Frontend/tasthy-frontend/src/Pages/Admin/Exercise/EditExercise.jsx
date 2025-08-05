import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Box,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import { updateExercise } from "../../../Services/AdminServices/AdminExerciseService";

const difficultyOptions = [
    { value: "1", label: "Rất dễ" },
    { value: "2", label: "Dễ" },
    { value: "3", label: "Trung bình" },
    { value: "4", label: "Khó" },
    { value: "5", label: "Rất khó" },
];

const recommendedOptions = [
    { value: "Shoulder", label: "Vai" },
    { value: "Arm", label: "Tay" },
    { value: "Leg", label: "Chân" },
    { value: "Core", label: "Bụng" },
    { value: "Chest", label: "Ngực" },
    { value: "Back", label: "Lưng" }
];

export default function EditExerciseModal({ open, onClose, onSuccess, exercise }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        difficultyLevel: "1",
        caloriesBurnedPerRep: "",
        recommendedFor: "shoulder",
        requiresEquipment: false,
        videoUrl: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const numericFields = ["caloriesBurnedPerRep"];


    useEffect(() => {
        if (exercise) {
            setForm({
                name: exercise.name || "",
                description: exercise.description || "",
                difficultyLevel: exercise.difficultyLevel || "1",
                caloriesBurnedPerRep: String(exercise.caloriesBurnedPerRep || ""),
                recommendedFor: exercise.recommendedFor || "shoulder",
                requiresEquipment: exercise.requiresEquipment || false,
                videoUrl: null,
            });
        }
    }, [exercise]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (numericFields.includes(name)) {
            const normalized = value.replace(/,/g, ".");
            const valid = /^$|^[0-9]+([.][0-9]*)?$|^[.][0-9]+$/.test(normalized);
            if (!valid) return;
            setForm((prev) => ({ ...prev, [name]: normalized }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFile = (e) => {
        setForm((prev) => ({ ...prev, videoUrl: e.target.files?.[0] || null }));
    };

    const handleCheckbox = (e) => {
        setForm((prev) => ({ ...prev, requiresEquipment: e.target.checked }));
    };

    const handleSubmit = async () => {
        if (!exercise?.exerciseId) return;
        if (!form.name.trim()) {
            toast.error("Tên bài tập không được để trống");
            return;
        }

        try {
            setSubmitting(true);
            await updateExercise(exercise.exerciseId, form);
            toast.success("Cập nhật bài tập thành công!");
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại");
        } finally {
            setSubmitting(false);
        }
    };
    const API_HOST = 'https://localhost:5000';
    const renderVideoPreview = () => {
        if (!exercise?.videoUrl) return null;

        const isYouTube = /youtube\.com|youtu\.be/.test(exercise.videoUrl);
        return (
            <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 2 }}>
                {isYouTube ? (
                    <iframe
                        src={exercise.videoUrl.replace("watch?v=", "embed/")}
                        title="Video hướng dẫn"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 2 }}
                    />
                ) : (
                    <video
                        src={`${API_HOST}${exercise.videoUrl}`}
                        controls
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 8, backgroundColor: "#000" }}
                    />
                )}
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Cập nhật bài tập</DialogTitle>
            <DialogContent dividers>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Tên bài tập"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Mô tả"
                        name="description"
                        multiline
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel>Cấp độ</InputLabel>
                        <Select
                            label="Cấp độ"
                            name="difficultyLevel"
                            value={form.difficultyLevel}
                            onChange={handleChange}
                        >
                            {difficultyOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Calo / rep"
                        name="caloriesBurnedPerRep"
                        value={form.caloriesBurnedPerRep}
                        onChange={handleChange}
                        type="text"
                        inputMode="decimal"
                        fullWidth
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel>Nhóm cơ gợi ý</InputLabel>
                        <Select
                            label="Nhóm cơ gợi ý"
                            name="recommendedFor"
                            value={form.recommendedFor}
                            onChange={handleChange}
                        >
                            {recommendedOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={form.requiresEquipment} onChange={handleCheckbox} />}
                        label="Cần dụng cụ"
                    />
                    {renderVideoPreview()}
                    <Button variant="outlined" component="label">
                        {form.videoUrl ? form.videoUrl.name : "Chọn video mới (tuỳ chọn)"}
                        <input type="file" accept="video/*" hidden onChange={handleFile} />
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={submitting}>Huỷ</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}
