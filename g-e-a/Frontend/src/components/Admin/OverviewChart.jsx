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
            const normalizedAgents = Array.isArray(agents) ? agents.map(agent => {
                // If agent is already in the right format, just return it
                if (agent.companyName || agent.email) {
                    return {
                        ...agent,
                        createdAt: agent.createdAt,
                        _id: agent._id
                    };
                }

                // Otherwise, try to normalize it
                const agentKey = Object.keys(agent).find(key => key !== '_id' && key !== 'createdAt');
                return agentKey ? {
                    ...agent[agentKey],
                    createdAt: agent.createdAt,
                    _id: agent._id,
                    name: agentKey
                } : agent;
            }) : [];

            // Calculate date range for the last year
            const now = new Date();
            const lastYear = new Date(now);
            lastYear.setFullYear(now.getFullYear() - 1);

            // Filter records to only include those from the last year
            const filterByLastYear = (records) => {
                return records.filter(record => {
                    const date = getDateFromCreatedAt(record.createdAt);
                    return date && date >= lastYear && date <= now;
                });
            };

            const lastYearInstitutions = filterByLastYear(institutions);
            const lastYearAgents = filterByLastYear(normalizedAgents);
            const lastYearStudents = filterByLastYear(students);

            // Calculate last week's percentage change (keep this for the header)
            const calculateLastWeekChange = () => {
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);

                const twoWeeksAgo = new Date(now);
                twoWeeksAgo.setDate(now.getDate() - 14);

                const countRecordsInRange = (records, startDate, endDate) =>
                    records.filter(record => {
                        const date = getDateFromCreatedAt(record.createdAt);
                        return date && date >= startDate && date <= endDate;
                    }).length;

                const currentWeek = {
                    institutions: countRecordsInRange(institutions, oneWeekAgo, now),
                    agents: countRecordsInRange(normalizedAgents, oneWeekAgo, now),
                    students: countRecordsInRange(students, oneWeekAgo, now),
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

            // Create monthly buckets for the last year
            const buckets = [];
            for (let i = 0; i < 12; i++) {
                const monthStart = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
                monthStart.setHours(0, 0, 0, 0);

                const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
                monthEnd.setHours(23, 59, 59, 999);

                buckets.push({
                    name: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    startDate: monthStart,
                    endDate: monthEnd,
                    institutions: 0,
                    agents: 0,
                    students: 0,
                });
            }

            // Count records in each bucket
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

            countRecords(lastYearInstitutions, 'institutions');
            countRecords(lastYearAgents, 'agents');
            countRecords(lastYearStudents, 'students');

            // Format chart data
            const formattedData = buckets.map(bucket => ({
                name: bucket.name,
                institutions: bucket.institutions,
                agents: bucket.agents,
                students: bucket.students,
            }));

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
                        <Typography>Platform activity over the past year</Typography>
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
                        No activity data available for the past year
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default OverviewChart;