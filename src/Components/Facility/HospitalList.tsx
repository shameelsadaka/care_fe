import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import {Card, CardContent, CardHeader, CircularProgress, Tooltip, Typography, IconButton, Menu, MenuItem} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch} from "react-redux";
import {getFacilities} from "../../Redux/actions";
import TitleHeader from "../Common/TitleHeader";
import Pagination from "../Common/Pagination";
import AddCard from '../Common/AddCard';
import { navigate } from 'hookrouter';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: '8px'
    },
    card: {
        height: 160,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    title: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: 400,
        //padding: '10px',
        //fontSize: '14px',
        display: 'inline-block',
        [theme.breakpoints.up('md')]: {
            width: '12vw'
        },
        [theme.breakpoints.down('sm')]: {
            width: '40vw'
        },
        [theme.breakpoints.down('xs')]: {
            width: '65vw'
        }
    },
    content: {
        padding:'5px 10px'
    },
    cardHeader:{
        padding:'10px'
    },
    contentText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'inline-block',
        [theme.breakpoints.up('md')]: {
            width: '10vw'
        },
        [theme.breakpoints.down('sm')]: {
            width: '40vw'
        },
        [theme.breakpoints.down('xs')]: {
            width: '40vw'
        }
    },
    spacing: {
        marginLeft: theme.spacing(1)
    },
    margin: {
        margin: theme.spacing(1)
    },
    addUserCard: {
        marginTop: '50px'
    },
    paginateTopPadding: {
        paddingTop: '50px'
    },
    userCardSideTitle:{
        fontSize: '13px'
    },
    toolTip:{
        fontSize:'13px'
    },
    displayFlex: {
        display: 'flex'
    },
    minHeight: {
        minHeight: '65vh'
    }
}));

export const HospitalList = () => {
    const classes = useStyles();
    const dispatch: any = useDispatch();
    const initialData: any[] = [];
    const [data, setData] = useState(initialData);

    let manageFacilities: any = null;
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const limit = 15;
    const initialPaginateData = {
        page: 1,
        offset: 0,
        limit
    };
    const [ currentPage, setCurrentPage ] = useState(1);

    const fetchData = (paginateData: any) => {
        setIsLoading(true);
        dispatch(getFacilities(paginateData))
            .then((resp:any)=> {
                const res = resp && resp.data;
                setData(res.results);
                setTotalCount(res.count);
                setIsLoading(false);
            });
    };
    useEffect(() => {
        fetchData(initialPaginateData);
    }, [dispatch]);

    const handlePagination = (page: any, perPage: any) => {
        setCurrentPage(page);
        const paginateData = {
            page,
            offset: perPage,
            limit
        };
        fetchData(paginateData);
    };
    let facilityList: any[] = [];
    if (data && data.length) {
        facilityList = data.map((facility: any, idx: number) => {
            return (
                <Grid item xs={12} md={3}  key={`usr_${facility.id}`} className={classes.root}>
                    <Card className={classes.card}>
                        <CardHeader
                            className={classes.cardHeader}
                            title={
                                <span className={classes.title}>
                                    <Tooltip
                                        title={<span className={classes.toolTip}>{facility.name}</span>}
                                        interactive={true}>
                                        <span>{facility.name}</span>
                                    </Tooltip>
                                </span>
                            }
                        />
                        <CardContent className={classes.content}>
                            <Typography>
                                <span className={`w3-text-gray ${classes.userCardSideTitle}`}>District - </span>{facility.district}
                            </Typography>
                        </CardContent>
                        <CardContent className={classes.content}>
                            <Typography>
                                <span className={`w3-text-gray ${classes.userCardSideTitle}`}>Oxygen Capacity - </span>{facility.oxygen_capacity}
                            </Typography>
                        </CardContent>
                        <CardContent className={classes.content}>
                            <Typography>
                                <span className={`w3-text-gray ${classes.userCardSideTitle}`}>Contact - </span>{facility.phone_number}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            );
        });
    }
    if (isLoading || !data) {
        manageFacilities = (
            <Grid item md={12} className={classes.displayFlex}>
                <Grid container justify="center" alignItems="center">
                    <CircularProgress/>
                </Grid>
            </Grid>
        );
    } else if (data && data.length) {
        manageFacilities = facilityList;
    } else if (data && data.length === 0) {
        manageFacilities = (
            <Grid item xs={12} md={12} className={classes.displayFlex}>
                <Grid container justify="center" alignItems="center">
                    <h5> No Users Found</h5>
                </Grid>
            </Grid>
        );
    }

    return (
        <div>
            <TitleHeader title="Facilities" showSearch={false}>
            </TitleHeader>
            <Grid container className={classes.minHeight}>
                <AddCard 
                    title={'+ Add New Hospital'} 
                    onClick={()=>navigate('/facilities/create')}
                />
                {manageFacilities}
            </Grid>
            <Grid container>
                {(data && data.length > 0 && totalCount > limit) && (
                    <Grid container className={`w3-center ${classes.paginateTopPadding}`}>
                        <Pagination
                            cPage={currentPage}
                            defaultPerPage={limit}
                            data={{ totalCount }}
                            onChange={handlePagination}
                        />
                    </Grid>
                )}
            </Grid>
        </div>
    );

}
