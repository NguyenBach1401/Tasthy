import React, { useState } from "react";
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
    FormControl, FormHelperText
} from "@mui/material";
import { toast } from "react-toastify";
import { createExercise } from "../../../Services/AdminServices/AdminExerciseService";

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

export default function AddExerciseModal({ open, onClose, onSuccess }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        difficultyLevel: "1",
        caloriesBurnedPerRep: "",
        recommendedFor: "",
        requiresEquipment: false,
        videoUrl: null,
    });
    const [errors, setErrors] = useState({
        name: "",
        caloriesBurnedPerRep: "",
        recommendedFor: "",
        videoUrl: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const numericFields = ["caloriesBurnedPerRep"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (numericFields.includes(name)) {
            // Chấp nhận 0-9 , . và chuỗi rỗng
            const valid = /^$|^[0-9]+([.,][0-9]*)?$/.test(value);
            if (valid) setForm((prev) => ({ ...prev, [name]: value }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFile = e => {
        setForm(prev => ({ ...prev, videoUrl: e.target.files?.[0] || null }));
    };

    const handleCheckbox = e => {
        setForm(prev => ({ ...prev, requiresEquipment: e.target.checked }));
    };

    const resetState = () => {
        setForm({
            name: "",
            description: "",
            difficultyLevel: "1",
            caloriesBurnedPerRep: "",
            recommendedFor: "shoulder",
            requiresEquipment: false,
            videoUrl: null,
        });
    };
    const validate = () => {
        const newErr = {
            name: !form.name.trim() ? "Tên bài tập không được để trống" : "",
            caloriesBurnedPerRep: !form.caloriesBurnedPerRep
                ? "Vui lòng nhập calo/rep"
                : "",
            recommendedFor: !form.recommendedFor
                ? "Hãy chọn nhóm cơ gợi ý"
                : "",
            videoUrl: !form.videoUrl ? "Phải chọn video mô tả" : "",
        };

        setErrors(newErr);
        // trả về true nếu KHÔNG có lỗi
        return Object.values(newErr).every((v) => v === "");
    };
    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setSubmitting(true);
            const result = await createExercise(form);
            toast.success("Thêm bài tập thành công!");
            resetState();
            onSuccess?.(result);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Thêm bài tập thất bại");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Thêm bài tập</DialogTitle>
            <DialogContent dividers>
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="Tên bài tập"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={Boolean(errors.name)}
                        helperText={errors.name}
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
                            {difficultyOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
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
                        error={Boolean(errors.caloriesBurnedPerRep)}
                        helperText={errors.caloriesBurnedPerRep}
                    />
                    <FormControl fullWidth error={Boolean(errors.recommendedFor)}>
                        <InputLabel>Nhóm cơ gợi ý</InputLabel>
                        <Select
                            label="Nhóm cơ gợi ý"
                            name="recommendedFor"
                            value={form.recommendedFor}
                            onChange={handleChange}
                        >
                            {recommendedOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{errors.recommendedFor}</FormHelperText>
                    </FormControl>
                    <FormControlLabel
                        control={<Checkbox checked={form.requiresEquipment} onChange={handleCheckbox} />}
                        label="Cần dụng cụ"
                    />
                    <Button variant="outlined" component="label">
                        {form.videoUrl ? form.videoUrl.name : "Chọn video hướng dẫn"}
                        <input type="file" accept="video/*" hidden onChange={handleFile} />
                    </Button>
                    {errors.videoUrl && (
                        <FormHelperText error sx={{ mt: 0.5 }}>
                            {errors.videoUrl}
                        </FormHelperText>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={submitting}>Huỷ</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}
