import OpenAI from "openai"
import config from '../config.json'
import { Handler, APIGatewayEvent } from 'aws-lambda'
import snowflake from 'snowflake-sdk'

const openai = new OpenAI({
  apiKey: config.apiKey,
})

const connection = snowflake.createConnection({
  account: 'rtcoror',
  username: 'ashleigh',
  password: '',
  application: "reapitsales",
})

const propertySchema = `
TABLE Property_sales_completions
name,type,kind,null?,default,primary key,unique key,check,expression,comment,policy name
ID,VARCHAR(32),COLUMN,Y,,N,N,,,,
PROPERTY_ID,VARCHAR(32),COLUMN,Y,,N,N,,,,
PROPERTY_CODE,VARCHAR(9),COLUMN,Y,,N,N,,,,
OFFER_ID,VARCHAR(32),COLUMN,Y,,N,N,,,,
OFFICE_ID,VARCHAR(32),COLUMN,Y,,N,N,,,,
NEGOTIATOR_ID,VARCHAR(32),COLUMN,Y,,N,N,,,,
COMPLETION_DATE,DATE,COLUMN,Y,,N,N,,,,
EXCHANGED_PRICE,"NUMBER(38,0)",COLUMN,Y,,N,N,,,,
PERCENT_OF_ASKING_PRICE,"NUMBER(38,1)",COLUMN,Y,,N,N,,,,
DAYS_SINCE_VALUATION,"NUMBER(9,0)",COLUMN,Y,,N,N,,,,
DAYS_SINCE_INSTRUCTION,"NUMBER(9,0)",COLUMN,Y,,N,N,,,,
DAYS_SINCE_ACCEPTED_OFFER,"NUMBER(9,0)",COLUMN,Y,,N,N,,,,
DAYS_SINCE_EXCHANGE,"NUMBER(9,0)",COLUMN,Y,,N,N,,,,
_CUSTOMER_ID,VARCHAR(16777216),COLUMN,Y,,N,N,,,,
_LAST_SYNCH_AT,TIMESTAMP_TZ(9),COLUMN,Y,,N,N,,,,
`

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST,OPTIONS',
}

export const handler: Handler = async  (event: APIGatewayEvent) => {

  const snowflakeConnection = await new Promise<any>((resolve, reject) => connection.connect((error, connection) => {
    console.log('inside snowflake connection promise')
    if (error) reject(error)
    resolve(connection)
  }))

  if (event.httpMethod === 'options') {
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
      }
    }
  }

  const request = JSON.parse(event.body || '{}')

  if (!request.text) {
    return {
      statusCode: 400,
      body: 'Text is a required property',
      headers: {
        ...corsHeaders,
      }
    }
  }

  const result = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an SQL query generation assistant. You will be given a business anaylsis based question and will be required to return just an SQL query to be ran against the provided schema without explanation."
      },
      { role: 'system', content: propertySchema },
      { role: 'user', content: request.text },
    ],
    model: 'gpt-3.5-turbo',
    max_tokens: 150,
    temperature: 0,
    stop: ['#', ';'],
    top_p: 1,
  })

  console.log('result', result)

  const snowflakeResult = await snowflakeConnection.execute({
    sqlText: result.choices[0].message.content as string,
    complete: (err, stmt) => {
      if (err) {
        console.error(err)
        throw err
      }

      const rows: any[] = []

      stmt.streamRows({
        start: Math.max(0, stmt.getNumRows() - 5),
        end: stmt.getNumRows() - 1,
      }).on('data', (row) => rows.push(row))

      console.log('rows', rows)

      return rows
    }
  })

  console.log('snowflake result', snowflakeResult.getSqlText())

  return {
    statusCode: 200,
    headers: {'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(result),
  }
}
