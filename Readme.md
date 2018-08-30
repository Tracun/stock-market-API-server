The tracun API

Introduction

This is a simple API that provide simple quotation of financial market using the googleFinance

Example Request
Default
GET url http://tracun.com/home


Example Request
Searches for all tickers
GET url http://tracun.com/finance/api/v1/stocks


Example Request
Searches for a specific ticker
GET url http://tracun.com/finance/api/v1/stocks/<string:ticker>


Example Request
Save a new ticker
POST url http://tracun.com/finance/api/v1/newTicker/<string:ticker>


## License:

See [LICENSE](LICENSE).

## Contributing
Authors: Lucas Waiteman Bastos - Initial work

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.




