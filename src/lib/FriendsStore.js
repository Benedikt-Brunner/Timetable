// @ts-nocheck
import { get, writable } from "svelte/store";
import Lesson from "./Lesson.js";

export let friends = writable({
    friends: [{}],
    pending: [""]
});

export let filterList = writable([]);


export function get_friends_lessons() {
    let result_object = {
        lessons: [],
        lessons_merged: []
    };
    let friends_lessons = [];
    let friends_list = get(friends);
    for (let friend of friends_list.friends) {
        if (!get(filterList).includes(friend.name)) {
            friend.schedule.forEach(hour_block => {
                let cur_hour = hour_block.Hours;
                Object.values(hour_block).filter((value) => value !== cur_hour).forEach((lesson, index) => {
                    if(lesson.Room === "" && lesson.Subject === "" && lesson.Teacher === ""){
                        return;
                    }
                friends_lessons.push(new Lesson([lesson.Room], lesson.Subject, lesson.Teacher, [cur_hour], [`Day${index+1}`], [friend.name]));
                });
            });
        }
    }
    result_object.lessons = JSON.parse(JSON.stringify(friends_lessons));
    result_object.lessons_merged = merge(friends_lessons)
    return result_object;
}


/**
 * @param {Array<Lesson>} arr
 */
function merge(arr){

    let merged = [];
    while(arr.length > 0){
       let cur = arr.pop();
       let indeces = [];
       arr.forEach((lesson, index) => {
              if(lesson.equals(cur)){
                cur.merge(lesson);
                indeces.push(index);
              }
         });
         indeces.forEach((index,offset) => arr.splice(index-offset, 1));
         merged.push(cur);
    }
    return merged;
}


export function get_groups(){
    let colors = [
        "#1446A0",
        "#DB3069",
        "#F5D547",
        "#16324F",
        "#6EEB83",
        "#1BE7FF",
        "#E8AA14",
        "#BA7BA1",
        "#B4ADEA",
        "#621B00"
    ]
    let groups = [];
    let friends_list = get(friends);
    for (let friend of friends_list.friends) {
        if(friend.group === null){
            return;
        }
        if(!groups.includes(friend.group)){
            groups.push(friend.group);
        }
    }
    groups.sort();
    groups = groups.length != 0 ? groups.map((group) => {
        let friends_for_group = friends_list.friends.filter((friend) => friend.group === group);
        return {
            name: group,
            friends: friends_for_group,
            color : colors[groups.indexOf(group)%10]
        }
    }    
    ) : [];
    return groups;
}

export function get_friends_with_no_group(){
    let friends_list = get(friends).friends.filter((friend) => friend.group === null);
    return friends_list;
}
