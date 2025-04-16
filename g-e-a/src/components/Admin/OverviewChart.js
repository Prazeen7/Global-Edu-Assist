import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function OverviewChart({ institutions = [], agents = [], students = [] }) {
    const theme = useTheme();
    const [chartData, setChartData] = useState([]);
    const [lastWeekChange, setLastWeekChange] = useState({ institutions: 0, agents: 0, students: 0 });

    // Utility to handle createdAt formats
    const getDateFromCreatedAt = (createdAt) => {
        if (!createdAt) return null;
        if (typeof createdAt === 'string') {
            return new Date(createdAt);
        } else if (createdAt && createdAt.$date) {
            return new Date(createdAt.$date);
        }
        return null;
    };

    useEffect(() => {
        const processData = () => {
            // Normalize agent data
            const normalizedAgents = agents.map(agent => {
                const agentKey = Object.keys(agent).find(key => key !== '_id' && key !== 'createdAt');
                return {
                    ...agent[agentKey],
                    createdAt: agent.createdAt,
                    _id: agent._id,
                    name: agentKey
                };
            });

            const allRecords = [...institutions, ...normalizedAgents, ...students];

            if (allRecords.length === 0) {
                setChartData([]);
                setLastWeekChange({ institutions: 0, agents: 0, students: 0 });
                return;
            }

            const dates = allRecords
                .map(record => getDateFromCreatedAt(record.createdAt))
                .filter(date => date !== null);

            if (dates.length === 0) {
                setChartData([]);
                setLastWeekChange({ institutions: 0, agents: 0, students: 0 });
                return;
            }

            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            const timeSpanDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));

            // Calculate last week's percentage change
            const calculateLastWeekChange = () => {
                const oneWeekAgo = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                const twoWeeksAgo = new Date(maxDate.getTime() - 14 * 24 * 60 * 60 * 1000);

                const countRecordsInRange = (records, startDate, endDate) =>
                    records.filter(record => {
                        const date = getDateFromCreatedAt(record.createdAt);
                        return date && date >= startDate && date <= endDate;
                    }).length;

                const currentWeek = {
                    institutions: countRecordsInRange(institutions, oneWeekAgo, maxDate),
                    agents: countRecordsInRange(normalizedAgents, oneWeekAgo, maxDate),
                    students: countRecordsInRange(students, oneWeekAgo, maxDate),
                };

                const previousWeek = {
                    institutions: countRecordsInRange(institutions, twoWeeksAgo, oneWeekAgo),
                    agents: countRecordsInRange(normalizedAgents, twoWeeksAgo, oneWeekAgo),
                    students: countRecordsInRange(students, twoWeeksAgo, oneWeekAgo),
                };

                return {
                    institutions: previousWeek.institutions === 0
                        ? currentWeek.institutions > 0 ? 100 : 0
                        : Math.round(((currentWeek.institutions - previousWeek.institutions) / previousWeek.institutions) * 100),
                    agents: previousWeek.agents === 0
                        ? currentWeek.agents > 0 ? 100 : 0
                        : Math.round(((currentWeek.agents - previousWeek.agents) / previousWeek.agents) * 100),
                    students: previousWeek.students === 0
                        ? currentWeek.students > 0 ? 100 : 0
                        : Math.round(((currentWeek.students - previousWeek.students) / previousWeek.students) * 100),
                };
            };

            setLastWeekChange(calculateLastWeekChange());

            // Determine grouping
            let groupBy;
            if (timeSpanDays <= 7) {
                groupBy = 'day';
            } else if (timeSpanDays <= 30) {
                groupBy = 'week';
            } else {
                groupBy = 'month';
            }

            let buckets = [];
            if (groupBy === 'day') {
                let current = new Date(minDate);
                current.setUTCHours(0, 0, 0, 0);
                const endDate = new Date(maxDate);
                endDate.setUTCHours(23, 59, 59, 999);
                while (current <= endDate) {
                    const bucketStart = new Date(current);
                    const bucketEnd = new Date(current);
                    bucketEnd.setUTCDate(current.getUTCDate() + 1);
                    bucketEnd.setUTCMilliseconds(-1);
                    buckets.push({
                        name: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        startDate: bucketStart,
                        endDate: bucketEnd,
                        institutions: 0,
                        agents: 0,
                        students: 0,
                    });
                    current.setUTCDate(current.getUTCDate() + 1);
                }
            } else if (groupBy === 'week') {
                const weeks = Math.ceil(timeSpanDays / 7);
                for (let i = 0; i < weeks; i++) {
                    const startDate = new Date(minDate);
                    startDate.setUTCDate(startDate.getUTCDate() + (i * 7));
                    startDate.setUTCHours(0, 0, 0, 0);
                    const endDate = new Date(startDate);
                    endDate.setUTCDate(endDate.getUTCDate() + 6);
                    endDate.setUTCHours(23, 59, 59, 999);
                    buckets.push({
                        name: `Week ${i + 1}`,
                        startDate,
                        endDate,
                        institutions: 0,
                        agents: 0,
                        students: 0,
                    });
                }
            } else {
                let currentDate = new Date(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1);
                currentDate.setUTCHours(0, 0, 0, 0);
                const endMonth = new Date(maxDate.getUTCFullYear(), maxDate.getUTCMonth() + 1, 0);
                while (currentDate <= endMonth) {
                    const startDate = new Date(currentDate);
                    const endDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 0);
                    endDate.setUTCHours(23, 59, 59, 999);
                    buckets.push({
                        name: startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                        startDate,
                        endDate,
                        institutions: 0,
                        agents: 0,
                        students: 0,
                    });
                    currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
                }
            }

            // Count records
            const countRecords = (records, type) => {
                records.forEach(record => {
                    const recordDate = getDateFromCreatedAt(record.createdAt);
                    if (!recordDate) return;
                    for (const bucket of buckets) {
                        if (recordDate >= bucket.startDate && recordDate <= bucket.endDate) {
                            bucket[type]++;
                            break;
                        }
                    }
                });
            };

            countRecords(institutions, 'institutions');
            countRecords(normalizedAgents, 'agents');
            countRecords(students, 'students');

            // Format chart data
            const formattedData = buckets.map(bucket => {
                if (groupBy === 'day') {
                    return {
                        name: bucket.name,
                        institutions: bucket.institutions,
                        agents: bucket.agents,
                        students: bucket.students,
                    };
                } else if (groupBy === 'week') {
                    return {
                        name: `${bucket.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${bucket.endDate.toLocaleDateString('en-US', { day: 'numeric' })}`,
                        institutions: bucket.institutions,
                        agents: bucket.agents,
                        students: bucket.students,
                    };
                } else {
                    return {
                        name: bucket.name,
                        institutions: bucket.institutions,
                        agents: bucket.agents,
                        students: bucket.students,
                    };
                }
            });

            setChartData(formattedData);
        };

        processData();
    }, [institutions, agents, students]);

    return (
        <Card>
            <CardHeader
                title="Overview"
                subheader={
                    <Box>
                        <Typography>Platform activity over time</Typography>
                        <Typography variant="caption">
                            Last week change:
                            Institutions: {lastWeekChange.institutions}%
                            | Agents: {lastWeekChange.agents}%
                            | Students: {lastWeekChange.students}%
                        </Typography>
                    </Box>
                }
            />
            <CardContent>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 'auto']} />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="institutions"
                                name="Institutions"
                                fill={theme.palette.primary.main}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="agents"
                                name="Agents"
                                fill={theme.palette.primary.light}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="students"
                                name="Students"
                                fill={theme.palette.primary.dark}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No activity data available
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default OverviewChart;