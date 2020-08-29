import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (typeof title !== 'string') {
      throw Error('Title must be a string.');
    }
    if (typeof value !== 'number') {
      throw Error('Value must be a number.');
    }
    if (type !== 'income' && type !== 'outcome') {
      throw Error('Type must be income or outcome.');
    }

    const actualBalance = this.transactionsRepository.getBalance();
    if (type === 'outcome' && actualBalance.total - value < 0) {
      throw Error("You can't spend more than you have.");
    }
    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
