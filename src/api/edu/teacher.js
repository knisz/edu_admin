import request from '@/utils/request'

export default {

    getTeacherListPage(current, limit, teacherQuery) { //传入参数 要和后端的请求参数对应，js语法不需要写类型
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition'+'/'+current+'/'+limit,
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,    //两种方法都可以
            method: 'post',
            //后端使用teacherQuery条件对象，前端要用data将对象转化为json传送
            data: teacherQuery
        })
    },
    deleteTeacherId(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete'
        })
    },
    addTeacher(teacher) {
        return request({
            url: `/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher   //将讲师的信息已json的形式保存
        })
    },
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get',
        })
    },
    updateTeacherInfo(id,teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher/${id}`, 
            method: 'put',
            data: teacher   //将讲师的信息已json的形式保存
        })
    }
}



// 第二种方法
// export function getTeacherListPage(current, limit, teacherQuery) { //传入参数 要和后端的请求参数对应，js语法不需要写类型
//     return request({
//         //url: '/eduservice/teacher/pageTeacherCondition'+'/'+current+'/'+limit,
//         url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,    //两种方法都可以
//         method: 'post',
//         //后端使用teacherQuery条件对象，前端要用data将对象转化为json传送
//         data: teacherQuery
//     })
// }
// }
