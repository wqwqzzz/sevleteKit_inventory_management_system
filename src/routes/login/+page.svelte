<script>
    import { Button, Input, Title, Container, Card } from '@svelteuidev/core';
    import { goto } from '$app/navigation';
    let username = '';
    let password = '';
    

    const handleLogin = async () => {
        let response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (response.status == 200) {

            // 成功登录，进行跳转
            alert("登录成功");
           
            await goto('/store');

        } else {
            alert("登录失败，请联系管理员");
        }
    };
</script>

<Container style="height: 100vh; display: flex; align-items: center; justify-content: center;">
    <Card padding="xl" shadow="lg" style="border-radius: 12px; background: rgba(211, 211, 211, 0.4);">
        <Title order={2} align="center" style="margin-bottom: 1.5rem;">新加坡北疆餐厅酒水进销存系统</Title>
        <Input
            placeholder="Username"
            bind:value={username}
            required
            style="margin-bottom: 1rem;"
            variant="default"  
            radius="md"
        />
        <Input
            type="password"
            placeholder="Password"
            bind:value={password}
            required
            style="margin-bottom: 1.5rem;"
            variant="default" 
            radius="md"
        />
        <Button on:click={handleLogin} style="width: 100%;" variant="filled" color="blue">
            登录
        </Button>
    </Card>
</Container>

<style>
    body {
        background-color: #262323; /* 更新为淡灰色背景 */
        font-family: 'Arial', sans-serif;
    }

    h2 {
        color: #333;
    }

    input {
        font-size: 1rem;
    }

    /* 去掉 create account 的样式 */
</style>