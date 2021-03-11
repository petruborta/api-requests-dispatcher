# API REQUESTS DISPATCHER

Serverless service that makes Realtor API requests on behalf of the user in order to keep the API key secret.

NOTICE: This service can be customised according to your needs and the API used.

## Table of contents

* [Technologies](#technologies)
* [Setup](#setup)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## Technologies

* [Serverless](https://www.serverless.com/)
* [Realtor API](https://rapidapi.com/apidojo/api/realtor)
* [AWS Lambda](https://aws.amazon.com/lambda/)
* [AWS CloudFormation](https://aws.amazon.com/cloudformation/)

## Setup

* Install serverless framework (run command as `sudo` if you're using Linux)

  `$ npm i -g serverless`

* [Create an AWS IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) or use credentials of an existing one

* Set credentials so that Serverless knows what account to connect to when you run any terminal command

```shell
$ serverless config credentials \
    --provider aws \
    --key YOUR_ACCESS_KEY_ID \
    --secret YOUR_SECRET_ACCESS_KEY
```

* Create a service

  `$ serverless create --template aws-nodejs --path /path/to/your/api-requests-dispatcher`

* Clone this repository to your local machine and replace the files

  `$ git clone https://github.com/petruborta/api-requests-dispatcher.git`

* In `serverless.yml`, replace the value of `region` (line 11) with your own region

* Create `secrets.json` and replace for `"YOUR_REALTOR_API_KEY"` with your Realtor API key

  You can change `NODE_ENV`'s value to _production_ and `DOMAIN`'s value to your actual domain, once it's ready for production

```json
{
  "NODE_ENV": "dev",
  "REALTOR_API_KEY": "YOUR_REALTOR_API_KEY",
  "DOMAIN": "*"
}
```

* Deploy the API to AWS Lambda

  `$ serverless deploy`

  The endpoint will be logged to the console once it's deployed

* Test the API

```shell
$ curl --header "Content-Type: application/json" \
    --request GET \
    --data '{"realtorEndpoint":"city-and-state-code,"location":"Chicago"}' \
    https://{id}.execute-api.{region}.amazonaws.com/{stage}/send
```

## Status

Project is: functionally _finished_, but the code can be refactored in a more elegant manner

## Inspiration

Followed [this](https://dev.to/adnanrahic/building-a-serverless-contact-form-with-aws-lambda-and-aws-ses-4jm0) tutorial to implement a serverless contact form and refactored the code to make API requests instead and send the responses back to user, without leaking the API key

## Contact

Created by [@petruborta](https://petruborta.com/) - feel free to contact me!
