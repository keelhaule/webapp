var controllers = angular.module('controllers', []);

controllers.controller('LoginController',
		['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
			$scope.login = function () {
                var isFormInvalid = false;

                //check is form valid
                if ($scope.loginForm.email.$error.email || $scope.loginForm.email.$error.required) {
                    $scope.submittedEmail = true;
                    isFormInvalid = true;
                } else {
                    $scope.submittedEmail = false;
                }
                if ($scope.loginForm.password.$error.required) {
                    $scope.submittedPassword = true;
                    isFormInvalid = true;
                } else {
                    $scope.submittedPassword = false;
                }
                if (isFormInvalid) {
                    return;
                }

                console.log("call login");
                //Kinvey login starts
                        var promise = $kinvey.User.login({
                            username: $scope.username,
                            password: $scope.password
                        });
                        promise.then(
                            function (response) {
                                //Kinvey login finished with success
                                $scope.submittedError = false;
                                $location.path('/main/logged_in');
                            },
                            function (error) {
                                //Kinvey login finished with error
                                $scope.submittedError = true;
                                $scope.errorDescription = error.description;
                                console.log("Error login " + error.description);//
                            }
                        );
			}
			$scope.loginFacebook = function () {

                //Kinvey Facebook login starts
		        var promise = $kinvey.Social.connect(null, 'facebook', {
		            create: 'true'
		        });
		        promise.then(
		            function () {
                        //Kinvey Facebook login finished with success
		                console.log("social login Facebook success");
		                $location.path('/main/logged_in');
                        $scope.submittedFacebookError = false;
		            },
		            function (error) {
                        //Kinvey Facebook login finished with error
                        $scope.submittedFacebookError = true;
                        $scope.errorDescription = error.description;
		                console.log("social login Facebook error: " + error.description + " json: " + JSON.stringify(error));
		            }
		        );
		    }

            //Kinvey Twitter login starts
		    $scope.loginTwitter = function () {
		        var promise = $kinvey.Social.connect(null, 'twitter', {
		            create: 'true'
		        });
		        promise.then(
		            function () {
                        //Kinvey Twitter login finished with success
                        $scope.submittedTwitterError = false;
		                console.log("social login Twitter success");
		                $location.path('/main/logged_in');
		            },
		            function (error) {
                        //Kinvey Twitter login finished with error
                        $scope.submittedTwitterError = true;
                        $scope.errorDescription = error.description;
		                console.log("social login Twitter error: " + error.description + " json: " + JSON.stringify(error));
		            }
		        );
		    }
		    $scope.forgetPassword = function () {
		        console.log("forgetPassword");
		        $location.path("main/password_reset");
		    }
		    $scope.signUp = function () {
		        console.log("signUp");
		        $location.path("main/sign_up");
		    }
		}]);
controllers.controller('ResetPasswordController', 
		['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
            $scope.resetPassword = function () {
                //check are form fields correct
                if ($scope.resetPasswordForm.email.$error.email || $scope.resetPasswordForm.email.$error.required) {
                    $scope.submitted = true;
                    return;
                }else{
                    $scope.submitted = false;
                }
                //Kinvey reset password starts
                var promise = $kinvey.User.resetPassword($scope.email);
                promise.then(
                    function () {
                        //Kinvey reset password finished with success
                        console.log("resetPassword");
                        $location.path("main/login");
                    });
            }

            $scope.logIn = function () {
                console.log("logIn");
                $location.path("main/login");
            }
		}]);
controllers.controller('SignUpController', 
		['$scope', '$kinvey', "$location", function($scope, $kinvey, $location) {
			$scope.signUp = function () {
				console.log("signup");
                var isFormInvalid = false;

                //check is form valid
                if ($scope.registrationForm.email.$error.email || $scope.registrationForm.email.$error.required) {
                    $scope.submittedEmail = true;
                    isFormInvalid = true;
                } else {
                    $scope.submittedEmail = false;
                }
                if ($scope.registrationForm.password.$error.required) {
                    $scope.submittedPassword = true;
                    isFormInvalid = true;
                } else {
                    $scope.submittedPassword = false;
                }
                if (isFormInvalid) {
                    return;
                }

                //Kinvey signup starts
				var promise = $kinvey.User.signup({
		             username: $scope.email,
		             password: $scope.password,
		             email: $scope.email
		         });
				console.log("signup promise");
				promise.then(
						function () {
                            //Kinvey signup finished with success
                            $scope.submittedError = false;
							console.log("signup success");
							$location.path("main/logged_in");
						}, 
						function(error) {
                            //Kinvey signup finished with error
                            $scope.submittedError = true;
                            $scope.errorDescription = error.description;
							console.log("signup error: " + error.description);
						}
				);
			}
		}]);
controllers.controller('LoggedInController', 
		['$scope', '$kinvey', '$location', function($scope, $kinvey, $location)  {
            $scope.logout = function () {
                console.log("logout");

                //Kinvey logout starts
                var promise = $kinvey.User.logout();
                promise.then(
                    function () {
                        //Kinvey logout finished with success
                        console.log("user logout");
                        $kinvey.setActiveUser(null);
                        $location.path("main/login");
                    },
                    function (error) {
                        //Kinvey logout finished with error
                        alert("Error logout: " + JSON.stringify(error));
                    });
            }

			$scope.verifyEmail = function () {
			    var user = $kinvey.getActiveUser();

                //Kinvey verifying email starts
			    var promise = $kinvey.User.verifyEmail(user.username);
                promise.then(
			        function() {
                        //Kinvey verifying email finished with success
			            alert("Email was sent");
			        }
                );
			}
			$scope.username = $kinvey.getActiveUser().username;

            $scope.showEmailVerification = function () {
                var activeUser = $kinvey.getActiveUser();
                if (activeUser != null) {
                    //check is user confirmed email
                    var metadata = new $kinvey.Metadata(activeUser);
                    var status = metadata.getEmailVerification();
                    console.log("User email " + status + " " + activeUser.email);
                    if (status === "confirmed" || !(!!activeUser.email)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }]);
controllers.controller('addBooks',
    ['$scope','$kinvey','$location',function($scope,$kinvey,$location){
    $scope.searchInput ='';
    $scope.books = [];
    $scope.emptyList = true;
    $scope.searchInput ='';
    $scope.shelve = [];
    function handleError(Description){
        $scope.submittedError = true;
        $scope.errorDescription = Description;
    }
    $scope.fetchBook = function(){
        //Check Validity of input
        var inputISBN = $scope.searchInput;
        for(i in $scope.books){var book = $scope.books[i];
            if(book.ISBN_10 == inputISBN || book.ISBN_13 == inputISBN){
                handleError("Book already added");
                return;
            }
        }
        $kinvey.execute('bookSearch',{ISBN: inputISBN}).then(function(response){
                if(response.success){
                    var _book = response.book;

                    // check if book already added to the list
                    for(i in $scope.books){var book = $scope.books[i];
                        console.log(book.ISBN_10+' '+inputISBN);
                        if(book.ISBN_10 == _book.ISBN_10 || book.ISBN_13 == _book.ISBN_13){
                            handleError("Book already added to the list");
                            return;
                        }
                    }
                    $scope.books.push(_book);
                    if ($scope.emptyList) $scope.emptyList = false;

                }else{
                    handleError("Couldn't find the book with the ISBN "+inputISBN);
                }
            },function(error){
                handleError("Couldn't find the book with the ISBN "+inputISBN);
            }
        );
    }
    $scope.removeBook = function(index){
        $scope.books.splice(index,1);
    }
    $scope.addBook =  function(ISBN){

        if(!$scope.emptyList){
            var bookList;
            var shelve_name = "myCollection";
            for(i in $scope.books) { var _book = $scope.books[i];
                delete _book.$$hashKey; //remove angular ng-repeat added attribute
                var bookObject = {
                    book: _book,
                    shelve: shelve_name,
                    owner: $kinvey.getActiveUser()
                }
                $kinvey.DataStore.save('objects', bookObject, {
                    exclude: ['owner'],
                    relations: {
                        book: 'books',
                        owner: 'user'
                    }
                }).then(function(response){
                     console.log("getting to this aread");
                     var shelve = {} || $kinvey.getActiveUser().shelve;
                     shelve.books = [] || shelve.books;
                     shelve.owner = $kinvey.getActiveUser();
                     shelve.name = "myCollection" || shelve.name;
                     _book.ISBN_13 == undefined ? shelve.books.push(_book.ISBN_10) : shelve.books.push(_book.ISBN_13);
                     $kinvey.DataStore.save('shelves',shelve,{
                         exclude: ['owner'],
                         relations: {
                             owner: 'user'
                         }
                     });
                 },function(error){
                 //show some error
                 });
            }

        }
    }
}]);