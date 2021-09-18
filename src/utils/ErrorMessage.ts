class ErrorMessage{
  error: boolean = true;
  message!: string;

  constructor(message: string){
    this.message = message;
  }
}

export default ErrorMessage;