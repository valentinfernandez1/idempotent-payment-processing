curl --location 'localhost:8080/v1/api/payment' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpZGVtcG90ZW50LXBheW1lbnQtcHJvY2Vzc2luZyIsInN1YiI6IjEyIiwiaWF0IjoxNzY2NDE1MjE3LCJleHAiOjE3NjY0MTYxMTcsInJvbGUiOiJVU0VSIn0.4TOCiq7jEgxSC--FF0OOsjuunuNf0pWCqB0N2ZAOaGI' \
--header 'Idempotency-key: asdadfdsfasdfasdfasdaaafasdfas' \
--data '{
    "recipient": 13,
    "amount": 10
}' &
echo `` &
curl --location 'localhost:8081/v1/api/payment' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpZGVtcG90ZW50LXBheW1lbnQtcHJvY2Vzc2luZyIsInN1YiI6IjEyIiwiaWF0IjoxNzY2NDE1MjE3LCJleHAiOjE3NjY0MTYxMTcsInJvbGUiOiJVU0VSIn0.4TOCiq7jEgxSC--FF0OOsjuunuNf0pWCqB0N2ZAOaGI' \
--header 'Idempotency-key: asdadfdsfasdfasdfasdaaafasdfas' \
--data '{
    "recipient": 13,
    "amount": 10
}'

wait