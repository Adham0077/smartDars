import { User } from "../../entities/User.js";
import { WalletTransaction } from "../../entities/WalletTransaction.js";

export async function getUsers(userRepository) {
    return await userRepository.find();
}

export async function getUsersCount(userRepository) {
    return await userRepository.count();
}

export async function getPayments(paymentRepository, status = "pending") {
    return await paymentRepository.find({ where: { status } });
}

export async function confirmPayment(payment, userRepository, paymentRepository, userRepository2) {
    if (payment.status === "pending") {
        const user = await userRepository.findOne({ where: { id: payment.userId } });
        if (!user) throw new Error("User topilmadi");

        user.balance += payment.amount;
        await userRepository.save(user);

        payment.status = "confirmed";
        await paymentRepository.save(payment);
    }
}
