    import React, { useEffect, useState } from 'react'
    import { Card ,Input,Button,List, Alert,Checkbox,Progress,Typography,Space} from 'antd'
    import { DeleteOutlined, EditOutlined, PlusOutlined, ProfileOutlined } from '@ant-design/icons'
    import  "../pages_style/home.css";
    import axios from 'axios';



    function HomePage() {
        const {Paragraph} = Typography;
        const [tasks, SetTasks] = useState([]);
        const [task, SetTask] = useState("");
        const [isChange, SetIsChange] = useState(true);
        const [joke, setJoke] = useState("Loading...");

        useEffect(()=>{
        fetchRandomJokes();
            
        },[])

        useEffect(() => {
            const res = localStorage.getItem("storedTasks");
            if (res) {
                SetTasks(JSON.parse(res));
            } else {
                SetTasks([]);
            }
        }, [isChange]);

        async function fetchRandomJokes() {
            try {
                const res =await axios.get("https://api.chucknorris.io/jokes/random");
                setJoke(`Today's Joke: "${res.data.value}"`);
            } catch (error) {
                setJoke("Today's Joke IS Unavailable");
            }
            
            // console.log(res.data);
        }
        
        function progessIndicator() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed).length;
            const progressPercent =
            totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
            return progressPercent;
        }


        function handleTaskInput(params) {
            SetTask(params.target.value);
        }


        function handleAddTask() {
            if (!task.trim()) return alert("Please Enter something");
                SetTasks(prev =>{
                const updatedList = [...prev,{ text: task, completed: false }]
                    localStorage.setItem("storedTasks",
                    JSON.stringify(updatedList)               
                    );
                    return updatedList;
                }
            );
            SetIsChange(prev=> !prev);
            //   console.log(localStorage.getItem("storedTasks"));
            
                SetTask("");    
        }

        function changeStatus(index) {
            SetTasks(prev => {
                const updatedList = prev.map(
                (value, i)=>{
                    if (i === index) {
                    return {...value,"completed":!value.completed}
                    }
                    return value;
                }
                
            )

            localStorage.setItem(
                "storedTasks",
                JSON.stringify(updatedList)
            );

            return updatedList;
            }
        
        );
            
        }

        function handleUpdatedTask(index) {
        const updatedTask = prompt("Enter Updated Task");
        if (!updatedTask || !updatedTask.trim()) return;

        SetTasks(prev => {
            const updatedList = prev.map((value, i) => {
                if (i === index) {
                    return { ...value, text: updatedTask };
                }
                return value;
            });

            
            localStorage.setItem(
                "storedTasks",
                JSON.stringify(updatedList)
            );

            return updatedList;
        });

        SetIsChange(prev => !prev);
        }    

        function handleDeleteTask(index) {
            SetTasks(prev => {
                const updatedList = prev.filter((value, i) => {
                    return i != index;
                });
                
                localStorage.setItem(
                    "storedTasks",
                    JSON.stringify(updatedList)
                );
                return updatedList;
            });

            SetIsChange(prev => !prev);
        }


    return (
        <div>
            <h1 className='headline'>My Task Manager</h1>
            <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: 'Read more' }}
                style={{
                    background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
                    padding: '18px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    color: '#1f2937',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    marginBottom: '20px',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
            >
                {joke}
            </Paragraph>


            <Card className='card'>
                <Progress
                    percent={progessIndicator()}
                    
                />
                
                <label htmlFor="Task" > Enter Task: * </label>
                <Input placeholder='Enter Task' onChange={handleTaskInput}  value={task} required />     
                <Button type='primary' icon={<PlusOutlined/>} className='button' style={{background:'orange'}} onClick={handleAddTask}> Add Task</Button>
                
            </Card>

            {
                tasks.length === 0 ? 

                <h1 style={{textAlign:"center"}}>No Task Added yet....!</h1> :

                
                <List 
                    bordered

                    dataSource={tasks}
                    renderItem={(item,index) => (
                        <List.Item
                            className='task-list'
                            key={index}
                                actions={[
                                    <Checkbox
                                        checked={item.completed}
                                        onChange={()=>changeStatus(index)}

                                    />,
                                    <Button type='link' icon={<EditOutlined/>} className='button' onClick={()=>handleUpdatedTask(index)}> </Button>,
                                    <Button type='link' danger icon={<DeleteOutlined/>} className='button' onClick={()=>handleDeleteTask(index)}> </Button>
                                ]}
                            >
                                
                         <span
                            style={{
                                marginLeft: 10,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '15px',
                                textDecoration: item.completed ? 'line-through' : 'none',
                                color: item.completed ? '#6b7280' : '#111827',
                                backgroundColor: item.completed ? '#f3f4f6' : '#ecfeff',
                                transition: 'all 0.2s ease',
                            }}
                            >
                            {item.text}
                        </span>

                        </List.Item>

                    )
                }
                        
                />                   
            }

        </div>
    )
    }

    export default HomePage