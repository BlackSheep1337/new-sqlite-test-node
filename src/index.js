import { createServer } from 'node:http';
import { setTimeout } from 'node:timers/promises';
import { select, insert } from "./db.js";
import SqlBricks from 'sql-bricks';
import { once } from 'node:events';

const PORT = 3000;

createServer(async (request, response) => {
    if (request.method === 'GET') {
        const items = select(
            SqlBricks.select('name,phone')
                .orderBy('name')
                .from('students')
                .toString()
        );

        return response.end(JSON.stringify(items));
    }

    if (request.method === 'POST') {
        const item = JSON.parse(await once(request, 'data'));
        insert({ table: 'students', items: [item] });

        response.end(
            JSON.stringify({
                message: `Student: ${item.name} created with sucess!`
            })
        )
    }
})
    .listen(PORT, () => console.log(`server is running on port:${PORT}`));

await setTimeout(500);

{
    const result = await (await fetch('http://localhost:3000')).json();

    console.log('GET', result);
}

{
    const result = await (await fetch('http://localhost:3000', {
        method: 'POST',
        body: JSON.stringify({
            name: 'Alecful',
            phone: '21314-331928'
        })
    })).json();

    console.log('POST', result);
}
