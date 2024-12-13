import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';

import {_tasks, _posts, _timeline} from 'src/_mock';
import {DashboardContent} from 'src/layouts/dashboard';

import {AnalyticsNews} from '../analytics-news';
import {AnalyticsTasks} from '../analytics-tasks';
import {AnalyticsCurrentVisits} from '../analytics-current-visits';
import {AnalyticsOrderTimeline} from '../analytics-order-timeline';
import {AnalyticsWebsiteVisits} from '../analytics-website-visits';
import {AnalyticsWidgetSummary} from '../analytics-widget-summary';
import {AnalyticsTrafficBySite} from '../analytics-traffic-by-site';
import {AnalyticsCurrentSubject} from '../analytics-current-subject';
import {AnalyticsConversionRates} from '../analytics-conversion-rates';

import {LeadsSourcesPie} from "../../leads/graph/leads-sources-pie";
import {LeadsOverTheYearGraph} from "../../leads/graph/leads-over-the-year-graph";

import {LOCAL_STORAGE_KEYS, LocalStorage} from "../../../utils/LocalStorage";
import {UserService} from "../../../services/UserService";
import {useEffect, useState} from "react";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
    const [campaigns, setCampaigns] = useState([]);
    const [leads, setLeads] = useState([]);

    const userInfo = JSON.parse(LocalStorage.getItem(LOCAL_STORAGE_KEYS.USER.BASIC_INFO) || '{}');

    useEffect(() => {
        async function loadCampaigns() {
            const campaigns = await UserService.getCampaigns();
            if (campaigns.status === 200 && campaigns.data.length) {
                setCampaigns(campaigns.data);
            } else {
                setCampaigns([]);
            }
        }
        loadCampaigns();

        async function loadLeads() {
            const leads = await UserService.getLeads();
            if (leads.status === 200 && leads.data.length) {
                setLeads(leads.data);
            }
            else {
                setLeads([]);
            }
        }
        loadLeads();
    }, []);

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{mb: {xs: 3, md: 5}}}>
                Hi, Welcome back {userInfo.name} 👋
            </Typography>

            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Campaigns"
                        // percent={3.6}
                        total={campaigns.length}
                        color="error"
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-message.svg"/>}
                        chart={{
                            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            // series: [56, 30, 23, 54, 47, 40, 62, 73],
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Leads"
                        // percent={-0.1}
                        total={leads.length}
                        color="secondary"
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg"/>}
                        chart={{
                            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            // series: [56, 47, 40, 62, 73, 30, 23, 54],
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Weekly sales"
                        percent={2.6}
                        total={714000}
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-bag.svg"/>}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [22, 8, 35, 50, 82, 84, 77, 12],
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Purchase orders"
                        percent={2.8}
                        total={1723315}
                        color="warning"
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-buy.svg"/>}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                            series: [40, 70, 50, 28, 70, 75, 7, 64],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <LeadsSourcesPie
                        title="Lead Sources (Platform)"
                        subheader={leads.length === 0 ? 'No data yet' : undefined}
                        chart={{
                            series: leads.length === 0 ? [
                                { label: 'No Data', value: 0 }
                            ] : leads.reduce((acc, lead) => {
                                const platform = lead.campaign_platform || 'Unknown';
                                const existingPlatform = acc.find(item => item.label === platform);
                                
                                if (existingPlatform) {
                                    existingPlatform.value += 1;
                                } else {
                                    acc.push({
                                        label: platform,
                                        value: 1
                                    });
                                }
                                
                                return acc;
                            }, [])
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <LeadsSourcesPie
                        title="Lead Sources (Campaign)"
                        subheader={leads.length === 0 ? 'No data yet' : undefined}
                        chart={{
                            series: leads.length === 0 ? [
                                { label: 'No Data', value: 0 }
                            ] : leads.reduce((acc, lead) => {
                                const campaignName = lead['campaign_name'] || 'Unknown';
                                const existingCampaign = acc.find(item => item['label'] === campaignName);

                                if (existingCampaign) {
                                    existingCampaign['value'] += 1;
                                } else {
                                    acc.push({
                                        label: campaignName,
                                        value: 1
                                    });
                                }

                                return acc;
                            }, [])
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <LeadsOverTheYearGraph
                        title="Leads Over Time"
                        subheader={leads.length === 0 ? 'No data yet' : undefined}
                        chart={{
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            series: [
                                {
                                    name: 'Leads',
                                    data: leads.length === 0 ? Array(12).fill(0) : 
                                        Array.from({ length: 12 }, (_, monthIndex) => {
                                            return leads.filter(lead => {
                                                const leadDate = new Date(lead.created_at);
                                                return leadDate.getMonth() === monthIndex && 
                                                       leadDate.getFullYear() === new Date().getFullYear();
                                            }).length;
                                        })
                                }
                            ]
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsConversionRates
                        title="Conversion rates"
                        subheader="(+43%) than last year"
                        chart={{
                            categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
                            series: [
                                {name: '2022', data: [44, 55, 41, 64, 22]},
                                {name: '2023', data: [53, 32, 33, 52, 13]},
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsCurrentSubject
                        title="Current subject"
                        chart={{
                            categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
                            series: [
                                {name: 'Series 1', data: [80, 50, 30, 40, 100, 20]},
                                {name: 'Series 2', data: [20, 30, 40, 80, 20, 80]},
                                {name: 'Series 3', data: [44, 76, 78, 13, 43, 10]},
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsNews title="News" list={_posts.slice(0, 5)}/>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsOrderTimeline title="Order timeline" list={_timeline}/>
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsTrafficBySite
                        title="Traffic by site"
                        list={[
                            {value: 'facebook', label: 'Facebook', total: 323234},
                            {value: 'google', label: 'Google', total: 341212},
                            {value: 'linkedin', label: 'Linkedin', total: 411213},
                            {value: 'twitter', label: 'Twitter', total: 443232},
                        ]}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsTasks title="Tasks" list={_tasks}/>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
