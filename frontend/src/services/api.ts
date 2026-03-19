import axios from "axios";

//Go backend data

export interface Leave{
    ID?: number; //backend generates
    employee_name: string;
    leave_type: string;
    start_date: string; //as ISO strings
    end_date: string;
    reason: string;
    status?: string; //backend default - pending
}

//axios instance
const API = axios.create({
    baseURL: 'http://localhost:8080/api',

});

//fetch leaves
export const getLeaves = async(): Promise<Leave[]> =>{
    const response = await API.get('/leaves');
    return response.data.data;
};

//create leave
export const createLeave = async(leaveData: Leave): Promise<Leave> =>{
    const response = await API.post('/leaves', leaveData);
    return response.data.data;
};

export default API;