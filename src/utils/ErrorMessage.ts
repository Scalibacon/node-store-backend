class ErrorMessage{
  error: boolean = true;
  status: number;
  message!: string;

  constructor(message: string, status: number = 500){
    this.message = message;
    this.status = status;
  }
}

export default ErrorMessage;