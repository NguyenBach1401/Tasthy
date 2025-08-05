import { Box, Tooltip, Typography } from '@mui/material';

const monthsVN = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const daysVN = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const getStatusColor = (status) => {
    switch (status) {
        case 'success': return '#4caf50';
        case 'fail': return '#f44336';
        default: return '#e0e0e0';
    }
};

const HeatmapCalendar = ({ data }) => {
    const statusMap = new Map();
    data.forEach(item => {
        statusMap.set(item.date, item.status);
    });

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const recentMonths = [-2, -1, 0].map(offset => {
        const d = new Date(currentYear, currentMonth + offset);
        return {
            label: `${monthsVN[d.getMonth()]}`,
            startCol: (offset + 2) * 6,
        };
    });

    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    startDate.setMonth(currentMonth - 3);
    const dayOfWeek = startDate.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;
    startDate.setDate(startDate.getDate() - diffToMonday);

    const totalDays = 7 * 18;
    const toLocalISO = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
            d.getDate()
        ).padStart(2, '0')}`;
    const days = Array.from({ length: totalDays }, (_, i) => {
        const date = new Date(startDate.getTime() + i * 86400000);
        const dateStr = toLocalISO(date);
        return {
            date,
            dateStr,
            status: statusMap.get(dateStr) || 'none',
        };
    });

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight="bold" mb={2}>
                Hành trình trong 3 tháng gần nhất
            </Typography>

            {/* Tiêu đề tháng căn giữa */}
            <Box display="flex" justifyContent="center" mb={2}>
                {recentMonths.map((month, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            width: 6 * 34,
                            textAlign: 'center',
                            fontSize: 13,
                            fontWeight: 'bold',
                            color: '#333',
                        }}
                    >
                        {month.label}
                    </Box>
                ))}
            </Box>

            <Box display="flex" justifyContent="center">
                {/* Cột T2 → CN */}
                <Box display="flex" flexDirection="column" mr={2}>
                    {daysVN.map((d, idx) => (
                        <Typography
                            key={idx}
                            sx={{
                                width: 34,
                                height: 40,
                                fontSize: 18,
                                color: '#666',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {d}
                        </Typography>
                    ))}
                </Box>

                {/* 3 nhóm cột theo tháng */}
                <Box display="flex" gap={2}>
                    {[0, 6, 12].map((startCol, monthIdx) => (
                        <Box key={monthIdx} display="grid" gridTemplateColumns="repeat(6, 34px)" gap="6px">
                            {Array.from({ length: 6 }).map((_, col) => (
                                <Box
                                    key={col}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    {days.slice((startCol + col) * 7, (startCol + col + 1) * 7).map((day, row) => (
                                        <Tooltip
                                            title={`Ngày ${day.date.toLocaleDateString('vi-VN')}: ${day.status === 'success'
                                                ? 'Hoàn thành 🎉'
                                                : day.status === 'fail'
                                                    ? 'Chưa đạt 😞'
                                                    : 'Không có dữ liệu'
                                                }`}
                                            arrow
                                            key={row}
                                            slotProps={{
                                                tooltip: {
                                                    sx: {
                                                        fontSize: 18,
                                                        padding: '8px 12px',
                                                    },
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    border: '1px solid #ccc',
                                                    borderRadius: 2,
                                                    backgroundColor:
                                                        day.status === 'success'
                                                            ? '#d0f0d0'
                                                            : day.status === 'fail'
                                                                ? '#f8d0d0'
                                                                : '#fff',
                                                    color:
                                                        day.status === 'success'
                                                            ? 'green'
                                                            : day.status === 'fail'
                                                                ? 'red'
                                                                : '#000',
                                                    fontSize: 20,
                                                    fontWeight: 'bold',
                                                    transition: '0.2s',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)',
                                                        boxShadow: '0 0 3px rgba(0,0,0,0.3)',
                                                    },
                                                }}
                                            >
                                                {day.status === 'success' ? '✔' : day.status === 'fail' ? '✖' : ''}
                                            </Box>
                                        </Tooltip>
                                    ))}
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default HeatmapCalendar;
