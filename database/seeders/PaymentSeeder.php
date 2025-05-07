<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::whereHas('roles', fn ($q) => $q->where('name', 'teacher'))->first();

        $payments = [
            ['amount' => 1250, 'date' => now()->subMonths(3), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now()->subMonths(2), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now()->subMonths(1), 'status' => 'completed'],
            ['amount' => 1250, 'date' => now(), 'status' => 'pending'],
        ];

        foreach ($payments as $data) {
            Payment::create([
                'user_id' => $teacher->id,
                'amount' => $data['amount'],
                'date' => $data['date'],
                'status' => $data['status'],
            ]);
        }
    }
}
